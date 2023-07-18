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
  users: [
    {
      name: 'support',
      password: String(process.env.SUPPORT_PASS),
      ftp: {
        /** default options */
        directory: '/home/support',
        mask: '022',
      },
    },
  ],
  certificate: {
    /** default options */
    days: 365,
    fields: {
      commonName: '',
      country: '',
      location: '',
      state: '',
      organization: '',
      organizationUnit: '',
    },
    output: '/etc/ssl/private/cert.pem',
    rsa: 4096,
  },
  steps: {
    repare: true,
    apt: true,
    users: true,
    firewall: true,
    certificate: true,
    reboot: true,
  },
});
