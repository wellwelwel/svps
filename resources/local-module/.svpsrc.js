module.exports = {

   /* Set the SSH access from VPS */
   VPS: {
      host: '',
      port: 22,
      username: 'root',
      password: '',
      crontab: {
         /* Change to "false" to disable auto import cronjobs */
         path: './.cronjobs.sh',
         append: false
      }
   },

   /* Set the accesses you want to be created */
   FTP: {
      users: [
         {
            name: '',
            pass: '',
            path: '/var/www'
         },
      ],
      append: false
   },

   APACHE: {
      /* 5.6, 7.4 or 8.1 */
      'php-version': 8.1,
      /* You can create a .html or .php file and set as default index.(html|php) */
      'default-page': './index.html',
      'auto-assigin-www': true,
      'deny-access-to-default-virtual-host': true,
      modules: [ 'cli', 'common', 'bz2', 'curl', 'gmp', 'readline', 'sqlite3', 'xml', 'bcmath', 'gd', 'imagick', 'imap', 'intl', 'json', 'mbstring', 'mysql', 'opcache', 'soap', 'tidy', 'xmlrpc', 'xsl', 'zip' ]
   },

   /* Set an absolute JSON path or a HTTP GET Request JSON with domains to create the Virtaul Hosts */
   DOMAINS: './.domains.json',

   /* Set the accesses you want to be created or just remove SQL option */
   SQL: {
      root: {
         name: 'root',
         pass: 'dbrootpassword'
      },
      users: [
         {
            ip: 'localhost',
            name: 'dbuser',
            pass: 'dbpassword'
         },
      ],
      databases: [
         'mydb',
      ]
   },

   OPTIONS: {
      /* Set "true" to see all commands on console. Not secure, this will display the passwords. */
      verbose: false,
   },

   /* The commands entered here will be executed after all steps are completed and before rebooting. */
   APPEND_COMMANDS: () => [],
};