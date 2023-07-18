/**
 * Using a Docker Container to create a local VPS with RDP:
 * docker run -d --privileged -p 22:22 -p 3389:3389 --restart always wellwelwel/vps:latest
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
  steps: {
    repare: true,
    apt: true,
    firewall: true,
    desktop: true,
    reboot: true,
  },
});
