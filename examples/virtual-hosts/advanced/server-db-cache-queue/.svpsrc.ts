/**
 * Use this file as `.svpsrc.js` 🧙🏻
 *
 * Advanced Usage Limitations:
 *
 * - Requires Docker and Docker Compose knowledge
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
      type: 'advanced',
      domain: 'site.com',
      port: 5000,
      www: true,
      // It will upload all local contents from **Docker Compose** file root via `SFTP` to this domain path: `/var/www/${domain}/`.
      compose: './docker-compose.yml',
    },
  ],
});

/**
 * Except for `access` and `virtualHosts`, by running `npx svps set domains`, every option from ".svpsrc.js" will be ignored
 */
