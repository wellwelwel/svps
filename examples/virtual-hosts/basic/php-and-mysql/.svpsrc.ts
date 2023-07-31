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
// import { defineConfig } from 'svps';
import { defineConfig } from '../../../../lib/index.js';

export default defineConfig({
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
  apache: {},
  docker: true,
});

/**
 * Except for `access` and `virtualHosts`, by running `npx svps set domains`, every option from ".svpsrc.js" will be ignored
 */
