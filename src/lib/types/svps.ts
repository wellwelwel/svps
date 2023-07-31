import { APACHE } from './apache.js';
import { CERTIFICATE } from './certificate.js';
import { CRONTAB } from './crontab.js';
import { MYSQL } from './mysql.js';
import { NODE } from './node.js';
import { PHP } from './php.js';
import { STEPS } from './steps.js';
import { USER } from './users.js';
import { VERBOSE } from './verbose.js';

export interface svpsOptions {
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
  /** Set `crontabs` from a local file */
  crontab?: CRONTAB;
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
}
