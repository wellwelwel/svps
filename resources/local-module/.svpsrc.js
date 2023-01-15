// @ts-check
import { defineConfig } from 'svps';

export default defineConfig({
   VPS: {
      host: '',
      username: 'root',
      password: '',
      crontab: {
         path: './.cronjobs.sh',
      },
   },

   FTP: {
      users: [
         {
            name: '',
            pass: '',
            path: '/var/www',
         },
      ],
      ssl: {
         days: 365,
         rsa: 4096,
         country: '',
         state: '',
         location: '',
         organization: '',
         organizationUnit: '',
         commonName: '',
      },
      append: false,
   },

   APACHE: {
      'php-version': 8.2,
      'default-page': './index.html',
      'auto-assigin-www': true,
      'deny-access-to-default-virtual-host': true,
      modules: [
         'cli',
         'common',
         'bz2',
         'curl',
         'gmp',
         'readline',
         'sqlite3',
         'xml',
         'bcmath',
         'gd',
         'imagick',
         'imap',
         'intl',
         'json',
         'mbstring',
         'mysql',
         'opcache',
         'soap',
         'tidy',
         'xmlrpc',
         'xsl',
         'zip',
      ],
   },

   NODE: {
      version: 18,
      npm: {
         global: ['pm2'],
         server: {
            autostart: true,
         },
      },
   },

   DOMAINS: './.domains.json',

   SQL: {
      root: {
         name: 'root',
         pass: '',
      },
      users: [
         {
            ip: 'localhost',
            name: '',
            pass: '',
         },
      ],
      databases: ['mydb'],
   },

   OPTIONS: {
      verbose: false,
      steps: {
         repare: true,
         apt: true,
         firewall: true,
         apache: true,
         ftp: true,
         vh: true,
         php: true,
         node: true,
         mysql: true,
         crontab: true,
         user: true,
         reboot: true,
      },
   },

   APPEND_COMMANDS: () => [],
});
