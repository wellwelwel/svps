import { ConnectConfig } from 'ssh2';

export interface VPS extends ConnectConfig {
   host: string;
   username: string;
}

export interface CRONTAB {
   /** Local path with the `crontab commands` */
   path: string;
   /**
    * Keeps or reset previous `crontabs` and append new commands
    *
    * default: `false`
    */
   append?: boolean;
}

export interface USERS {
   name: string;
   pass: string;
   /** Directory that the content will be displayed when logging into FTP */
   directory: string;
   /**
    * Allows user to use "sudo" commands
    *
    * default: `false`
    */
   administrator?: boolean;
   /** Put the main group as the first item */
   groups?: string[];
   /** Install `FTP` protocol using the `vsftpd` */
   ftp?: {
      ssl?: {
         /** default: `365` */
         days?: number;
         /** default: `4096` */
         rsa?: number;
         /** default: `''` */
         country?: string;
         /** default: `''` */
         state?: string;
         /** default: `''` */
         location?: string;
         /** default: `''` */
         organization?: string;
         /** default: `''` */
         organizationUnit?: string;
         /** default: `''` */
         commonName?: string;
      };
      /**
       * Keeps or reset previous users and append new users
       */
      append?: boolean;
   };
   /** Enable `SFTP` protocol to the current user */
   sftp?: {
      /** You need to define a directory for the root and user `SFTP` */
      directories: {
         /**
          * Set the `ChrootDirectory`
          *
          * Ex.: `/home`
          */
         root: string;
         /**
          * Set the user `SFTP` workspace
          *
          * Ex.: `/home/user`
          */
         user: string;
      };
      /**
       * Set the mask from 0777
       *
       * Ex.: `0077` defines the default permissions to `0700` and `0600`
       *
       * default: `0022`
       */
      mask?: string;
   };
}

export interface PHP {
   /**
    * 5.6, 7.4, 8.1, 8.2...
    *
    * default: `8.2`
    */
   version?: number;
   /**
    * You can create a .html or .php file and set as default index.(html|php)
    *
    * default: `./index.html`
    */
   defaultPage?: string;
   /**
    * Instead of set domains like `[ "site.com", "www.site.com" ]`, set it to `true` to auto assign `www` cname
    *
    * default: `true`
    */
   www?: boolean;
   /**
    * Set to `false` to prevents your server from being accessed directly by IP
    *
    * default: `false`
    */
   accessFromIP?: boolean;
   modules?: string[];
}

export interface NODE {
   /**
    * 12, 14, 16, 18, 19...
    *
    * default: `18`
    */
   version: number;
   npm: {
      /**
       * `npmjs` packages to instaal globally
       *
       * To use domains with `node`, it needs `pm2` package
       */
      global: string[];
   };
}

/**
 * Local path with the domains list
 *
 * default: `./.domains.json`
 */
export type DOMAINS = string;

export interface MYSQL {
   /** Creates root password */
   root: {
      /** Set the `root` password */
      pass: string;
      /** Change name of `root` user in `MySQL` */
      name?: string;
   };
   /** Creates `MySQL` users */
   users: {
      host: string;
      name: string;
      pass: string;
   }[];
   /** Creates the empty `databases` */
   databases: string[];
}

export interface STEPS {
   repare?: boolean;
   apt?: boolean;
   firewall?: boolean;
   apache?: boolean;
   ftp?: boolean;
   vh?: boolean;
   php?: boolean;
   node?: boolean;
   mysql?: boolean;
   crontab?: boolean;
   user?: boolean;
   reboot?: boolean;
}

export interface OPTIONS {
   /** Set "true" to see all commands on console. Not secure, this will display the passwords. */
   verbose?: boolean;
   steps: STEPS;
}

export type APPEND_COMMANDS = () => string[];

export interface svpsOptions {
   /** Set the SSH access from VPS */
   VPS: VPS | VPS[];

   CRONTAB?: CRONTAB;

   /** Enable or disable the steps */
   OPTIONS: OPTIONS;

   /** Set the accesses you want to be created */
   USERS?: USERS[];

   PHP?: PHP;

   NODE?: NODE;

   /** Set an absolute JSON path or a HTTP GET Request JSON with domains to create the Virtaul Hosts */
   DOMAINS?: DOMAINS;

   /** Set the accesses you want to be created */
   MYSQL?: MYSQL;

   /** The commands entered here will be executed after all steps are completed and before rebooting */
   APPEND_COMMANDS?: APPEND_COMMANDS;
}

export const defineConfig = (options: svpsOptions): svpsOptions => options;
