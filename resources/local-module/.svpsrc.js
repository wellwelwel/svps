module.exports = {
   /* Set the SSH access from VPS */
   VPS: {
      host: '' /* Allows: String or Array | To use an array with multiple hosts, all hosts must have the same access */,
      port: 22,
      username: 'root',
      password: '',
      crontab: {
         /* Change to "false" to disable auto import cronjobs */
         path: './.cronjobs.sh',
         append: false,
      },
   },

   /* Set the accesses you want to be created */
   FTP: {
      users: [
         {
            name: '',
            pass: '',
            path: '/var/www' /* Directory that the content will be displayed when logging into FTP */,
            administrator: false /* Allows use of "sudo" commands */,
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
      /* 5.6, 7.4, 8.1, 8.2... */
      'php-version': 8.2,
      /* You can create a .html or .php file and set as default index.(html|php) */
      'default-page': './index.html',
      'auto-assigin-www': true,
      'deny-access-to-default-virtual-host': true /* Prevents your server from being accessed directly by IP */,
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
      /* 12, 14, 16, 18, 19... */
      version: 18,
      npm: {
         global: [
            // 'yarn',
            // 'bower',
            'pm2',
         ],
         server: {
            /* Using "pm2" global module */
            autostart: true,
         },
      },
   },

   /* Set an absolute JSON path or a HTTP GET Request JSON with domains to create the Virtaul Hosts */
   DOMAINS: './.domains.json',

   /* Set the accesses you want to be created or just remove SQL option */
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
      /* Set "true" to see all commands on console. Not secure, this will display the passwords. */
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
         reboot: true,
      },
   },

   /**
    * The commands entered here will be executed after all steps are completed and before rebooting.
    *
    * Append commands examples:
    *
    * Basic commands
    * APPEND_COMMANDS: () => [ 'apt update', 'apt upgrade -y' ],
    *
    * With external modules (Typeof Array - with strings contents)
    * APPEND_COMMANDS: () => [ ...require('./my-module-1'), ...require('./my-module-2') ],
    *
    * With external modules (Typeof Function - that returns an Array with strings contents)
    * APPEND_COMMANDS: () => [ ...require('./my-module-1')(), ...require('./my-module-2')() ],
    *
    * You can set all steps as "false" to run only your commands
    **/
   APPEND_COMMANDS: () => [],
};
