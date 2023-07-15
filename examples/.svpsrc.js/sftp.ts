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
      name: 'support',
      password: '1234',
      sftp: {
        /** default options */
        mask: '077',
        chRoot: '/home',
        chUser: '/home/support',
      },
    },
  ],
  steps: {
    firewall: true,
    users: true,
  },
});
