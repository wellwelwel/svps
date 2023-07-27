import fs from 'fs';
import fsp from 'fs/promises';
import { join } from 'path';
import { UPLOAD } from '../types/upload.js';
import { ensureDir, uploadFile } from '../ssh.js';
import { __dirname, cwd } from './root.js';

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

const getContents = async (
  dirPath: string,
  ignore: string[] = [
    '.git',
    'node_modules',
    '.Trashes',
    '.Spotlight-V100',
    '.DS_Store',
    'Icon',
    'Desktop.ini',
  ]
): Promise<Entries> => {
  const results: Entries = {
    dirs: [],
    files: [],
  };

  const readDir = async (dir: string) => {
    const entries = await fsp.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignore.includes(entry.name)) continue;

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

const setPath = (path: string) => {
  const currentPath = path
    .replace(
      new RegExp(
        __dirname
          .replace(/file:\//, '')
          .replace(/\//g, '\\/')
          .replace(/\./g, '\\.')
      ),
      ''
    )
    .replace(
      new RegExp(
        cwd
          .replace(/file:\//, '')
          .replace(/\//g, '\\/')
          .replace(/\./g, '\\.')
      ),
      ''
    )
    .replace(/\.\.(\/)?/g, '')
    .replace(/\.\//, '');
  return currentPath;
};

export const importFile = (path: string) => fs.readFileSync(path, 'utf-8');

export const upload = async (options: UPLOAD) => {
  console.log(`\n\x1b[22m\x1b[36m\x1b[1m⦿ Uploading Files\x1b[0m`);

  const { local, remote } = options;

  if (await isFile(local)) {
    uploadFile(local, remote);
  } else if (await isDir(local)) {
    const contents = await getContents(local);
    const longestSize = contents.files.reduce(
      (max, entry) => Math.max(max, entry.size.length),
      0
    );
    const remoteDir = setPath(remote).replace(/\/$/, '');

    console.log(
      `  \x1b[36m⌙\x1b[0m \x1b[0m\x1b[2m\x1b[3mEnsuring directories\x1b[0m`
    );

    await ensureDir(remote);

    for (const dir of contents.dirs) {
      const currentDir = setPath(dir).replace(/^\//, '');
      const remotePath = `${remoteDir}/${currentDir}`.replace(/\/\//g, '/');

      await ensureDir(remotePath);
    }

    for (const file of contents.files) {
      const currentFile = setPath(file.path).replace(/^\//, '');
      const remotePath = `${remoteDir}/${currentFile}`.replace(/\/\//g, '/');
      const message = `    \x1b[36m⌙ \x1b[0m\x1b[2m${file.size.padStart(
        longestSize,
        ' '
      )} ■ \x1b[0m\x1b[2m${remotePath}\x1b[0m`;

      console.log(message);

      await uploadFile(file.path, remotePath);
    }
  }
};
