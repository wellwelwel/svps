import { UPLOAD } from '../../types/upload.js';
import { upload } from '../prepare-files.js';

export const uploads = async (paths: UPLOAD[]) => {
  console.log(`\n\x1b[22m\x1b[36m\x1b[1m⦿ Uploading Files\x1b[0m`);

  await Promise.all(paths.map((path) => upload(path)));
};
