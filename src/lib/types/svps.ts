import { APACHE } from './apache.js';
import { CERTIFICATE } from './certificate.js';
import { CRONTAB } from './crontab.js';
import { MYSQL } from './mysql.js';
import { NODE } from './node.js';
import { PHP } from './php.js';
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
  apache?: APACHE | boolean;
  /**
   * Set `PHP` configurations
   *
   * default version: `8.2`
   */
  php?: PHP | boolean;
  /**
   * Set `node.js` configurations
   *
   * default version: `18`
   */
  node?: NODE | boolean;
  /** Set the accesses you want to be created */
  mysql?: MYSQL;
  /** Set `crontabs` from a local file */
  crontab?: CRONTAB;
  /**
   * Set `true` to see all commands in console
   *
   * Becareful, this will **display the passwords** on your console
   *
   * default: `false`
   */
  verbose?: VERBOSE;
  repair?: boolean;
  apt?: boolean;
  /**
   * 🤹🏻‍♀️ In case `mysql` has users, a firewall rule will be created for each one.
   *
   * 🖥️ In case `desktop` is enabled, it will add the port `3389`
   *
   * ⚠️ The firewall will add the `SSH` port according to the port set on the current VPS (host) or `22` if no port was entered
   *
   *  default: `false`
   */
  firewall?: boolean;
  docker?: boolean;
  /**
   * 🖥️ Intalls the `Xubuntu Desktop` and `RDP Remote` in port `3389`
   *
   * ⚠️ The desktop installation can take longer (about 5 to 30 minutes) and take up more disk space (about 1GB to 3GB).
   *
   * default: `false`
   */
  desktop?: boolean;
  reboot?: boolean;
}
