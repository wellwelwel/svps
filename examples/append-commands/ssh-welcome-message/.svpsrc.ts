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
import { defineConfig, escapeQuotes } from '../../../lib/index.js';
import fs from 'fs';

const bashrc = fs.readFileSync('./my-bashrc.sh', 'utf-8');
const quotedBashrc = escapeQuotes(bashrc);

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: String(process.env.USER),
      password: process.env.PASS,
    },
  ],
  steps: {
    appendCommands: true,
  },
  /**
   * Your personal `sh` commands will be executed after all enabled steps and before rebooting, case enabled
   */
  appendCommands: () => [`echo ${quotedBashrc} | cat > ~/.bashrc`],
});
