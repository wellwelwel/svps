import { SVPS } from '../lib/index.js';

(async () => {
  try {
    // Establishing connection
    const svps = new SVPS({
      access: {
        host: process.env?.HOST || '127.0.0.1',
        username: String(process.env.USER),
        password: process.env.PASS,
        port: Number(process.env.PORT) || 22,
      },
    });

    const mount = await svps.mount({
      // Testing users
      users: [
        {
          name: 'support',
          password: '123',
          sudo: true,
          // Testing SFTP
          sftp: {
            chRoot: '/var/containers/',
            chUser: '/var/containers/domains',
            mask: '077',
          },
          // Testing FTP
          ftp: {
            mask: '077',
          },
        },
        {
          name: 'manager',
          password: '456',
          // Testing SFTP
          sftp: {
            chRoot: '/var/www',
            chUser: '/var/www/domains',
          },
          // Testing FTP
          ftp: {
            directory: '/var/www',
          },
          // Testing groups
          groups: ['www-data'],
        },
      ],

      // Testing Apache2
      apache: true,

      // Testing Node.js 18 (LTS)
      node: {
        // Testing Global Node.js packages
        packages: ['yarn'],
      },

      // Testing MySQL
      mysql: {
        root: {
          pass: 'root',
        },
        databases: ['mydb'],
        users: [{ host: '127.0.0.1', name: 'manager', pass: '789' }],
      },

      // Testing RSA
      certificate: {
        days: 365 * 3,
        fields: {
          commonName: 'My VPS',
          country: 'BR',
          location: 'São Paulo',
          state: 'São Paulo',
          organization: 'Open Source',
          organizationUnit: 'Development',
        },
      },

      // Testing PHP 8.2 and Composer
      php: true,

      // Testing crontab
      crontab: {
        path: '../examples/crontab/crontab.sh',
        append: false,
      },

      // Testing repair commands
      repair: true,

      // Testing APT commands
      apt: true,

      // Testing Firewall (MySQL: yes, Desktop: no)
      firewall: true,

      // Testing Docker and Docker Compose
      docker: true,

      // Testing reboot
      reboot: true,

      // Incompatible with GitHub Actions
      desktop: false,
    });

    // Clearing storage
    await svps.commands([
      '--catch sudo apt-get purge mysql-* nodejs-* php-* nodejs php -y',
      '--catch sudo apt-get autoremove -y --purge',
      '--catch sudo apt-get clean -y',
      '--catch sudo apt-get autoclean -y',
      '--catch sudo dpkg --list | grep "^rc" | cut -d " " -f 3 | xargs sudo dpkg --purge',
      '--catch sudo find /var/log -type f -delete',
    ]);

    // Closing connection
    await svps.end();

    if (mount !== true) process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
