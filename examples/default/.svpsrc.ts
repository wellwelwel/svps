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
      name: '',
      password: '',
      sudo: false,
      sftp: true,
    },
  ],
  apache: {},
  php: {},
  node: {},
  mysql: {
    root: {
      pass: '',
    },
    users: [],
  },
  steps: {
    repair: true,
    apt: true,
    firewall: true,
    users: true,
    certificate: false,
    apache: false,
    docker: false,
    php: false,
    node: false,
    mysql: false,
    crontab: false,
    desktop: false,
    reboot: true,
  },
});
