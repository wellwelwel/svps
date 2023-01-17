import { ConnectConfig } from 'ssh2';

export interface VPS extends ConnectConfig {
   host: string;
   username: string;
}

export interface CRONTAB {
   /**
    * Local path with the `crontab commands`
    *
    * default: `./.cronjobs.sh`
    */
   path?: string;
   /**
    * Keeps or reset previous `crontabs` and append new commands
    *
    * default: `false`
    */
   append?: boolean;
}

export interface CERTIFICATE {
   /**
    * Certificate validity days
    *
    * default: `365`
    */
   days?: number;
   /**
    * RSA cyptography
    *
    * default: `4096`
    */
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
}

/** Install `FTP` protocol using the `vsftpd` */
export interface FTP {
   certificate?: CERTIFICATE;
}

/** Enable `SFTP` protocol to the current user */
export interface SFTP {
   /**
    * Set the `ChrootDirectory`
    *
    * default: `/home`
    */
   chRoot?: string;
   /**
    * Set the user `SFTP` workspace
    *
    * default: `/home/%u`
    */
   chUser?: string;
   /**
    * Set the mask from `0777`
    *
    * Ex.: `0077` defines the default permissions to `0700` and `0600`
    *
    * default: `0022`
    */
   mask?: string;
}

export interface USER {
   /** Username to login */
   name: string;
   /** User password to login */
   password: string;
   /**
    * Default directory for the current user
    *
    * default: `/home/%u`
    */
   directory?: string;
   /**
    * Allows user to use "sudo" commands
    *
    * default: `false`
    */
   sudo?: boolean;
   /** Put the main group as the first item */
   groups?: string[];
   ftp?: FTP | false;
   sftp?: SFTP | false;
}

export interface APACHE {
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
}

export interface PHP {
   /**
    * 5.6, 7.4, 8.1, 8.2...
    *
    * default: `8.2`
    */
   version?: number;
   /**
    * Set PHP modules to install
    *
    * default: [ 'cli', 'common', 'bz2', 'curl', 'gmp', 'readline', 'sqlite3', 'xml', 'bcmath', 'gd', 'imagick', 'imap', 'intl', 'json', 'mbstring', 'mysql', 'opcache', 'soap', 'tidy', 'xmlrpc', 'xsl', 'zip' ]
    */
   modules?: string[];
   /**
    * Install the PHP `compose`
    *
    * default: `true`
    */
   compose?: boolean;
}

export interface NODE {
   /**
    * 12, 14, 16, 18, 19...
    *
    * default: `18`
    */
   version?: number;
   /**
    * `npmjs` packages to install globally
    *
    * * To use `npx set domains` with `node`, it needs `pm2` as global package
    *
    * default: `[ 'pm2' ]`
    */
   packages?: string[];
}

export type DOMAINS = string;

export interface MYSQL_ROOT {
   /** Set the `root` password */
   pass: string;
   /**
    * Change name of `root` user in `MySQL`
    *
    * default: `root`
    */
   name?: string;
}

export interface MYSQL {
   /** Creates root access */
   root: MYSQL_ROOT;
   /** Creates `MySQL` users */
   users?: {
      host: string;
      name: string;
      pass: string;
   }[];
   /** Creates the empty `databases` */
   databases?: string[];
}

/** Enable or disable steps */
export interface STEPS {
   /** default: `true` */
   repare?: boolean;
   /** default: `true` */
   apt?: boolean;
   /** default: `true` */
   firewall?: boolean;
   /** default: `true` */
   users?: boolean;
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

export type VERBOSE = boolean;

export type APPEND_COMMANDS = () => string[];

export interface svpsOptions {
   /** Set the SSH access from VPS */
   vps: VPS | VPS[];

   /** Set `crontabs` from a local file */
   crontab?: CRONTAB;

   /** Set the accesses you want to be created */
   users?: USER | USER[];

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

   /**
    * Local path with the domains list
    *
    * * Use with `npx svps set domains`
    *
    * default: `./.domains.json`
    */
   domains?: DOMAINS;

   /** Set the accesses you want to be created */
   mysql?: MYSQL;

   /** Your personal commands will be executed after all enabled steps and before rebooting */
   appendCommands?: APPEND_COMMANDS;
}

/**
 * Auxiliary function to define the `svps` configurations
 * @param options
 */
export const defineConfig = (options: svpsOptions): svpsOptions => options;
