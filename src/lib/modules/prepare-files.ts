import fs from 'fs';
import fsp from 'fs/promises';
import { join, relative as relativePath, dirname } from 'path';
import { UPLOAD } from '../types/upload.js';
import { ensureDir, uploadFile } from '../ssh.js';
import { fileURLToPath } from 'url';
import { basicPermissions } from './basic-permissions.js';
import { cwd } from './root.js';

interface Entries {
  dirs: string[];
  files: { path: string; size: string }[];
}

const isDir = async (path: string): Promise<boolean> => {
  const stats = await fsp.stat(path);
  return stats.isDirectory();
};

export const isFile = async (path: string): Promise<boolean> => {
  const stats = await fsp.stat(path);
  return stats.isFile();
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0KB';

  const k = 1024;
  const dm = 0;
  const sizes = [
    'B\x1b[36m',
    'K\x1b[34m',
    'M\x1b[33m',
    'G\x1b[35m',
    'T\x1b[31m',
    'P\x1b[31m',
    'E\x1b[31m',
    'Z\x1b[31m',
    'Y\x1b[31m',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
};

const relative = (path: string) =>
  relativePath(fileURLToPath(cwd), path).replace(/\.\.\//g, '');

const getContents = async (
  dirPath: string,
  ignore: string[]
): Promise<Entries> => {
  const results: Entries = {
    dirs: [],
    files: [],
  };

  const readDir = async (dir: string) => {
    const entries = await fsp.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (
        [
          '.Trashes',
          '.Spotlight-V100',
          '.DS_Store',
          'Desktop.ini',
          '.localized',
          ...ignore,
        ].includes(entry.name)
      )
        continue;

      const fullPath = join(dir, entry.name);

      if (await isDir(fullPath)) {
        results.dirs.push(fullPath);

        await readDir(fullPath);
      } else if (await isFile(fullPath)) {
        const { size } = await fsp.stat(fullPath);

        results.files.push({ path: fullPath, size: formatSize(size) });
      }
    }
  };

  await readDir(dirPath);

  return results;
};

export const importFile = (path: string) => fs.readFileSync(path, 'utf-8');

export const upload = async (options: UPLOAD) => {
  const { local, remote, blacklist, permissions } = options;

  if (await isFile(local)) {
    const remoteDir = dirname(remote);
    console.log(
      `  \x1b[36m⌙\x1b[0m \x1b[0m\x1b[2mEnsuring the directory: \x1b[1m${remoteDir}\x1b[0m`
    );

    await ensureDir(remoteDir);

    console.log(`    \x1b[36m⌙ \x1b[0m\x1b[2m${remote}\x1b[0m`);
    await uploadFile(local, remote);
  } else if (await isDir(local)) {
    const contents = await getContents(
      local,
      blacklist || ['.git', 'node_modules']
    );
    const remoteDir = remote.replace(/\/$/, '');

    console.log(
      `  \x1b[36m⌙\x1b[0m \x1b[0m\x1b[2mEnsuring directories: \x1b[1m${remoteDir}\x1b[0m`
    );

    const longestSize = contents.files.reduce(
      (max, entry) => Math.max(max, entry.size.length),
      0
    );

    for (const dir of contents.dirs) {
      const currentDir = relative(dir);
      const remotePath = `${remoteDir}/${currentDir}`;

      /** Debug */
      // console.log('origin', dir);
      // console.log('expectedDir', currentDir);
      // console.log('remotePath', remotePath);
      // console.log();

      await ensureDir(remotePath);
    }

    for (const file of contents.files) {
      const currentFile = relative(file.path).replace(/^\//, '');
      const remotePath = `${remoteDir}/${currentFile}`;

      /** Debug */
      // console.log('origin', file.path);
      // console.log('expectedFile', currentFile);
      // console.log('remotePath', remotePath);
      // console.log();

      const message = `    \x1b[36m⌙ \x1b[0m\x1b[2m${file.size.padStart(
        longestSize,
        ' '
      )} ■ \x1b[0m\x1b[2m${remotePath}\x1b[0m`;

      console.log(message);

      await uploadFile(file.path, remotePath);
    }
  }

  if (permissions) await basicPermissions({ remote, ...permissions });
};

export const resourcesUpload = async (options: UPLOAD) => {
  const { local, remote } = options;

  if (await isFile(local)) {
    const remoteDir = dirname(remote);

    await ensureDir(remoteDir);
    await uploadFile(local, remote);
  }
};
