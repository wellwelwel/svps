import fs from 'fs/promises';
import { join } from 'path';

const blackList = ['.DS_Store', 'node_modules', '.git'];

export interface Entries {
  dirs: string[];
  files: string[];
}

export const isDir = async (path: string): Promise<boolean> => {
  const stats = await fs.stat(path);
  return stats.isDirectory();
};

export const isFile = async (path: string): Promise<boolean> => {
  const stats = await fs.stat(path);
  return stats.isFile();
};

export const getContents = async (dirPath: string): Promise<Entries> => {
  const results: Entries = {
    dirs: [],
    files: [],
  };

  const readDir = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (blackList.includes(entry.name)) continue;

      const fullPath = join(dir, entry.name);

      if (await isDir(fullPath)) {
        results.dirs.push(fullPath);
        await readDir(fullPath);
      } else if (await isFile(fullPath)) {
        results.files.push(fullPath);
      }
    }
  };

  await readDir(dirPath);

  return results;
};
