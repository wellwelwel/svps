import { PHP } from '../../index.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const php = (() => {
   if (!steps.php || !input?.php || typeof input?.php !== 'object') return null;

   return {
      version: input?.php && typeof input.php?.version === 'number' ? input.php.version : 8.2,
      modules:
         input?.php && Array.isArray(input.php?.modules)
            ? input.php.modules
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
   };
})() as Required<PHP> | null;
