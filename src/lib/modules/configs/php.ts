import { PHP } from '../../types/php.js';
import { svpsOptions } from '../../types/svps.js';
import { setSteps } from './steps.js';

export const setPHP = (configs: svpsOptions): Required<PHP> | null => {
  const steps = setSteps(configs);

  if (!steps.php || !configs?.php || typeof configs?.php !== 'object')
    return null;

  return {
    version:
      configs?.php && typeof configs.php?.version === 'number'
        ? configs.php.version
        : 8.2,
    modules:
      configs?.php && Array.isArray(configs.php?.modules)
        ? configs.php.modules
        : [
            'cli',
            'common',
            'bz2',
            'curl',
            'gmp',
            'readline',
            'sqlite3',
            'xml',
            'bcmath',
            'gd',
            'imagick',
            'imap',
            'intl',
            'json',
            'mbstring',
            'mysql',
            'opcache',
            'soap',
            'tidy',
            'xmlrpc',
            'xsl',
            'zip',
          ],
    composer:
      configs?.php && typeof configs.php?.composer === 'boolean'
        ? configs.php.composer
        : true,
  };
};
