export interface STEPS {
  /** default: `false` */
  repair?: boolean;
  /** default: `false` */
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
  /** default: `false` */
  users?: boolean;
  /** default: `false` */
  certificate?: boolean;
  /**
   * `Apache2` is required in `PHP` and `node.js`
   *
   * default: `false`
   */
  apache?: boolean;
  /** default: `false` */
  docker?: boolean;
  /** default: `false` */
  php?: boolean;
  /** default: `false` */
  node?: boolean;
  /** default: `false` */
  mysql?: boolean;
  /** default: `false` */
  crontab?: boolean;
  /**
   * 🖥️ Intalls the `Xubuntu Desktop` and `RDP Remote` in port `3389`
   *
   * ⚠️ The desktop installation can take longer (about 5 to 30 minutes) and take up more disk space (about 1GB to 3GB).
   *
   * default: `false`
   */
  desktop?: boolean;
  /** default: `false` */
  uploads?: boolean;
  /** default: `false` */
  appendCommands?: boolean;
  /** default: `false` */
  reboot?: boolean;
}
