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
  access: [
    {
      host: '127.0.0.1',
      username: String(process.env.USER),
      password: process.env.PASS,
    },
  ],
  users: [
    {
      name: 'manager',
      password: String(process.env.MANAGER_PASS),
      sftp: {
        chRoot: '/home/manager',
        chUser: '/home/manager/apps',
        mask: '022',
      },
    },
  ],
  node: {
    version: 20,
    packages: ['yarn'],
  },
  steps: {
    users: true,
    node: true,
  },
});
