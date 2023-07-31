import { svpsOptions } from '../../types/svps.js';
import { upload } from '../prepare-files.js';
import { setSteps } from './steps.js';

export const uploads = async (configs: svpsOptions) => {
  const steps = setSteps(configs);

  if (!steps.uploads || !configs?.uploads || !Array.isArray(configs.uploads))
    return null;

  console.log(`\n\x1b[22m\x1b[36m\x1b[1m⦿ Uploading Files\x1b[0m`);

  for (const toUpload of configs.uploads) {
    await upload(toUpload);
  }
};
