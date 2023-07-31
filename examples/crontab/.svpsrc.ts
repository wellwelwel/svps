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
  crontab: {
    path: './crontab.sh',
  },
  steps: {
    crontab: true,
  },
});
