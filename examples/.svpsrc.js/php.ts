/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// import { defineConfig } from 'svps';
import { defineConfig } from '../../lib/index.js';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: 'root',
      password: 'root',
    },
  ],
  users: [
    {
      name: 'manager',
      password: '1234',
      sftp: {
        chRoot: '/var/www',
        chUser: '/var/www/domains',
        mask: '022',
      },
      groups: ['www-data'],
    },
  ],
  apache: {
    accessFromIP: false,
  },
  php: {
    composer: true,
    version: 8.2,
  },
  steps: {
    repare: true,
    apt: true,
    firewall: true,
    users: true,
    apache: true,
    php: true,
    reboot: true,
  },
});
