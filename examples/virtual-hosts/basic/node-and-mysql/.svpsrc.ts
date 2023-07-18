/**
 * Basic Usage Limitations:
 *
 * - The Basic Virtual Hosts can't access each other (for example, to use them like an API)
 * - You can have a single database for domain
 * - You can use only PHP (7.4 or 8.2), NODE (LTS) and MySQL (8.x)
 * - You can't use custom languages or tools neither personalize their options
 *
 * For advanced usage, please see the advanced examples
 *
 * ---
 *
 * Accessing your database from PHP:
 *
 * HOST: db_{domain} (ex.: db_site.com)
 * USER: root (always)
 * PORT: 3306 (always)
 * Then, your database name and password 🧙🏻
 */

// @ts-check
// import { defineConfig } from 'svps';
import { defineConfig } from '../../../../lib/index.js';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: String(process.env.USER),
      password: process.env.PASS,
    },
  ],
  virtualHosts: [
    {
      type: 'basic',
      language: 'NODE',
      domain: 'site.com',
      port: 5000,
      mysql: {
        database: 'myLocalDB',
        password: '1234',
        expose: 5001,
      },
      www: true,
    },
  ],
});

/**
 * Except for `access` and `virtualHosts`, by running `npx svps set domains`, every option from ".svpsrc.js" will be ignored
 */
