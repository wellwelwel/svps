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
import { VIRTUAL_HOST } from './types/virtual-hosts.js';

/* eslint-disable no-duplicate-imports */
export type { ACCESS as Access } from './types/acess.js';
export type { APACHE as Apache } from './types/apache.js';
export type { APPEND_COMMANDS as AppendCommands } from './types/append-commands.js';
export type { CERTIFICATE as Certificate } from './types/certificate.js';
export type { CRONTAB as Crontab } from './types/crontab.js';
export type { DOMAINS as Domains } from './types/domains.js';
export type { MYSQL as MySQL } from './types/mysql.js';
export type { NODE as Node } from './types/node.js';
export type { PHP } from './types/php.js';
export type { STEPS as Steps } from './types/steps.js';
export type { USER as User } from './types/users.js';
export type { VERBOSE as Verbose } from './types/verbose.js';
export type { VIRTUAL_HOST as VirtualHost } from './types/virtual-hosts.js';
/* eslint-enable no-duplicate-imports */

export interface svpsOptions {
  /** Set the SSH access for one or more VPS */
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
   * Set `true` to see all commands in console
   *
   * Becareful, this will **display the passwords** on your console
   *
   * default: `false`
   */
  verbose?: VERBOSE;
  /**
   * The **`virtualHosts`** is used with `npx svps set domains`.
   *
   * It requires these steps from `npx svps mount`:
   *
   * ---
   *
   * Required:
   *   - `apache` (to proxy the virtual ports to `80`)
   *
   * Optionals:
   *   - `docker` (required to automatically create the **Basic Servers**)
   */
  virtualHosts?: VIRTUAL_HOST[];
}

/**
 * Auxiliary function to define the `svps` configurations
 * @param options
 */
export const defineConfig = (options: svpsOptions): svpsOptions => options;

export { escapeQuotes } from './modules/escape-quotes.js';
