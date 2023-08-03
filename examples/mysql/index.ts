/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { SVPS } from 'svps';
import { SVPS } from '../../lib/index.js';

const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
  },
});

await svps.mount({
  mysql: {
    root: {
      pass: 'root',
    },
    databases: ['mydb'],
    users: [
      {
        host: '127.0.0.1',
        name: 'local_user',
        pass: 'local_user-passowrd',
      },
      {
        host: '192.168.0.1',
        name: 'external_user',
        pass: 'external_user-password',
      },
    ],
  },
});

await svps.end();
