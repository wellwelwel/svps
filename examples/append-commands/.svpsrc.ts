/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { defineConfig } from 'svps';
import { defineConfig } from '../../lib/index.js';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: String(process.env.USER),
      password: process.env.PASS,
    },
  ],
  /**
   * Your personal `sh` commands will be executed after all enabled steps and before rebooting, case enabled
   */
  appendCommands: () => ['echo "\n🍃 („• ᴗ •„) 🌸\n"'],
  steps: {
    appendCommands: true,
  },
});
