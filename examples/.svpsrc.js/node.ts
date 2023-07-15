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
    repare: true,
    apt: true,
    firewall: true,
    users: true,
    node: true,
    reboot: true,
  },
});
