import { ACCESS } from './acess.js';
import { APACHE } from './apache.js';
import { APPEND_COMMANDS } from './append-commands.js';
import { CERTIFICATE } from './certificate.js';
import { CRONTAB } from './crontab.js';
import { DOMAINS } from './domains.js';
import { MYSQL } from './mysql.js';
import { NODE } from './node.js';
import { PHP } from './php.js';
import { STEPS } from './steps.js';
import { UPLOAD } from './upload.js';
import { USER } from './users.js';
import { VERBOSE } from './verbose.js';
import { VIRTUAL_HOST } from './virtual-hosts.js';

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
  uploads?: UPLOAD[];
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
