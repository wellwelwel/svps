import { ConnectConfig } from 'ssh2';

export interface VPS extends ConnectConfig {
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

export interface FTP {
   users: [
      {
         name: string;
         pass: string;
         /** Directory that the content will be displayed when logging into FTP */
         path: string;
         /** Allows user to use "sudo" commands */
         administrator: boolean;
      }
   ];
   ssl: {
      /** default: `365` */
      days: number;
      /** default: `4096` */
      rsa: number;
      /** default: `''` */
      country: string;
      /** default: `''` */
      state: string;
      /** default: `''` */
      location: string;
      /** default: `''` */
      organization: string;
      /** default: `''` */
      organizationUnit: string;
      /** default: `''` */
      commonName: string;
   };
   append: boolean;
}

export interface APACHE {
   'php-version': 5.6 | 7.4 | 8.2;
   /* You can create a .html or .php file and set as default index.(html|php) */
   'default-page': string;
   'auto-assigin-www': boolean;
   'deny-access-to-default-virtual-host': boolean /* Prevents your server from being accessed directly by IP */;
   modules: string[];
}

export interface NODE {
   version: 12 | 14 | 16 | 18 | 19;
   npm: {
      global: string[];
      server: {
         /* Using "pm2" global module */
         autostart: boolean;
      };
   };
}

export type DOMAINS = string;

export interface SQL {
   root: {
      name: string;
      pass: string;
   };
   users: [
      {
         ip: string;
         name: string;
         pass: string;
      }
   ];
   databases: string[];
}

export interface STEPS {
   repare: boolean;
   apt: boolean;
   firewall: boolean;
   apache: boolean;
   ftp: boolean;
   vh: boolean;
   php: boolean;
   node: boolean;
   mysql: boolean;
   crontab: boolean;
   user: boolean;
   reboot: boolean;
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
   FTP?: FTP;

   APACHE?: APACHE;

   NODE?: NODE;

   /** Set an absolute JSON path or a HTTP GET Request JSON with domains to create the Virtaul Hosts */
   DOMAINS?: DOMAINS;

   /** Set the accesses you want to be created or just remove SQL option */
   SQL?: SQL;

   /** The commands entered here will be executed after all steps are completed and before rebooting */
   APPEND_COMMANDS?: APPEND_COMMANDS;
}

export function defineConfig(
   options:
      | { VPS: VPS; OPTIONS: { steps: STEPS }; SQL: SQL }
      | { VPS: VPS; OPTIONS: { steps: STEPS }; CRONTAB: CRONTAB }
      | { VPS: VPS; OPTIONS: { steps: STEPS }; APACHE: APACHE }
      | { VPS: VPS; OPTIONS: { steps: STEPS }; NODE: NODE }
): svpsOptions;
export function defineConfig(options: svpsOptions): svpsOptions {
   return options;
}
