/**
 * Use this file as `.svpsrc.js` 🧙🏻
 *
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { defineConfig } from 'svps';
import { defineConfig } from '../../lib/index.js';

export default defineConfig({
  users: [
    {
      name: 'manager',
      password: String(process.env.MANAGER_PASS),
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
});
