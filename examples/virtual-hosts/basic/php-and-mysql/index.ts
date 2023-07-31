/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 -p 5001:5001 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { SVPS } from 'svps';
import { SVPS } from '../../../../lib/index.js';

const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: String(process.env.USER),
    password: process.env.PASS,
  },
});

/**
 * Install Apache2, Docker and create an user to manage the Virtual Hosts via SFTP
 */
await svps.mount();

await svps.createVirtualHosts([
  {
    /** PHP 8.2 */
    domain: 'site.com',
    port: 5000,
    www: true,
    server: {
      language: 'php',
      mysql: {
        database: 'myLocalDB',
        password: '1234',
        expose: 5001,
        isPublic: true,
      },
      permissions: {
        user: 'my-user',
      },
    },
  },
]);
