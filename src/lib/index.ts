import { ACCESS } from './types/acess.js';
import { APACHE } from './types/apache.js';
import { APPEND_COMMANDS } from './types/append-commands.js';
import { CERTIFICATE } from './types/certificate.js';
import { CRONTAB } from './types/crontab.js';
import { DOMAINS } from './types/domains.js';
import { MYSQL } from './types/mysql.js';
import { NODE } from './types/node.js';
import { PHP } from './types/php.js';
import { STEPS } from './types/steps.js';
import { USER } from './types/users.js';
import { VERBOSE } from './types/verbose.js';

export interface svpsOptions {
  /** Set the SSH access from one or more VPS */
  access: ACCESS | ACCESS[];
  /** Set the accesses you want to be created */
  users?: USER | USER[];
  /** Open SSL RSA Certificate
   *
   * output: `/etc/ssl/private/cert.pem`
   */
  certificate?: CERTIFICATE;
  /**
   * Set `Apache2` configurations
   *
   * `Apache2` is required in `PHP` and `node.js`
   *
   * default: `true`
   */
  apache?: APACHE;
  /**
   * Set `PHP` configurations
   *
   * default version: `8.2`
   */
  php?: PHP;
  /**
   * Set `node.js` configurations
   *
   * default version: `18`
   */
  node?: NODE;
  /** Set the accesses you want to be created */
  mysql?: MYSQL;
  /**
   * Local path with the domains list
   *
   * * Use with `npx svps set domains`
   *
   * default: `./.domains.json`
   */
  domains?: DOMAINS;
  /** Set `crontabs` from a local file */
  crontab?: CRONTAB;
  /** Your personal commands will be executed after all enabled steps and before rebooting */
  appendCommands?: APPEND_COMMANDS;
  /** Enable or disable the steps */
  steps?: STEPS;
  /**
   * Set "true" to see all commands in console
   *
   * Becareful, this will **display the passwords**
   *
   * default: `false`
   */
  verbose?: VERBOSE;
}

/**
 * Auxiliary function to define the `svps` configurations
 * @param options
 */
export const defineConfig = (options: svpsOptions): svpsOptions => options;
