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
      name: 'support',
      password: String(process.env.SUPPORT_PASS),
      sftp: {
        /** default options */
        mask: '077',
        chRoot: '/home',
        chUser: '/home/support',
      },
    },
  ],
  steps: {
    users: true,
  },
});
