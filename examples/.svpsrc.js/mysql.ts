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
  mysql: {
    root: {
      pass: 'root',
    },
    databases: ['mydb'],
    users: [
      { host: '127.0.0.1', name: 'local_user', pass: '1234' },
      { host: '192.168.0.1', name: 'external_user', pass: '1234' },
    ],
  },
  steps: {
    repare: true,
    apt: true,
    firewall: true,
    mysql: true,
    reboot: true,
  },
});
