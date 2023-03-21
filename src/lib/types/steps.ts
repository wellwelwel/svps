export interface STEPS {
   /** default: `true` */
   repare?: boolean;
   /** default: `true` */
   apt?: boolean;
   /**
    * 🤹🏻‍♀️ In case `mysql` has users, a firewall rule will be created for each one.
    *
    * 🖥️ In case `desktop` is enabled, it will add the port `3389`
    *
    * ⚠️ The firewall will add the `SSH` port according to the port set on the current VPS (host) or `22` if no port was entered
    *
    *  default: `true`
    */
   firewall?: boolean;
   /** default: `true` */
   users?: boolean;
   /** default: `true` */
   certificate?: boolean;
   /**
    * `Apache2` is required in `PHP` and `node.js`
    *
    * default: `true`
    */
   apache?: boolean;
   /** default: `true` */
   docker?: boolean;
   /** default: `true` */
   php?: boolean;
   /** default: `true` */
   node?: boolean;
   /** default: `true` */
   mysql?: boolean;
   /** default: `true` */
   crontab?: boolean;
   /**
    * 🖥️ Intalls the `Xubuntu Desktop` and `RDP Remote` in port `3389`
    *
    * ⚠️ The desktop installation can take longer (about 5 to 30 minutes) and take up more disk space (about 1GB to 3GB).
    *
    * default: `false`
    */
   desktop?: boolean;
   /** default: `true` */
   appendCommands?: boolean;
   /** default: `true` */
   reboot?: boolean;
}
