export interface STEPS {
   /** default: `true` */
   repare?: boolean;
   /** default: `true` */
   apt?: boolean;
   /** default: `true` */
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
   php?: boolean;
   /** default: `true` */
   node?: boolean;
   /** default: `true` */
   mysql?: boolean;
   /** default: `true` */
   crontab?: boolean;
   /** default: `true` */
   appendCommands?: boolean;
   /** default: `true` */
   reboot?: boolean;
}
