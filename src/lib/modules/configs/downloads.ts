import { downloadFile } from '../../ssh.js';
import { DOWNLOAD } from '../../types/download.js';

export const downloads = async (paths: DOWNLOAD[]) => {
  console.log(`\n\x1b[22m\x1b[36m\x1b[1m⦿ Downloading Files\x1b[0m`);

  const uploadPromises = paths.map((path) =>
    downloadFile(path.remote, path.local)
  );

  await Promise.all(uploadPromises);
};
