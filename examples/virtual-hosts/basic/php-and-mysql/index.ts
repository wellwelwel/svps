/**
 * Use this file as `.svpsrc.js` 🧙🏻
 *
 * Basic Usage Limitations:
 *
 * - The Basic Virtual Hosts can't access each other (for example, to use them like an API)
 * - You can have a single database for domain
 * - You can use only PHP (8.2), NODE (LTS) and MySQL (8.x)
 * - You can't use custom languages or tools neither personalize their options
 *
 * ---
 *
 * Accessing your database from PHP:
 *
 *  HOST: db_{domain} (ex.: db_site.com)
 *  USER: root (default)
 *  PORT: 3306 (always)
 *  Then, your database name and password 🔓
 *
 * Accessing your database externally:
 *
 *  HOST: {vps_host} (or "localhost" for use it on VPS itself)
 *  USER: root (default)
 *  PORT: {exposed_port} (ex. 5001)
 *  Then, your database name and password 🔓
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
await svps.mount({
  users: [
    {
      name: 'my-user',
      password: String(process.env.USER_PASS),
      sftp: {
        chRoot: '/var/containers/',
        chUser: '/var/containers/domains',
        mask: '077',
      },
    },
  ],
  apache: true,
  docker: true,
});

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
