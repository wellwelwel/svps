/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// import { defineConfig } from 'svps';
import { defineConfig } from '../../lib/index.js';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: 'root',
      password: 'root',
    },
  ],
  certificate: {
    days: 365 * 3,
    fields: {
      commonName: 'SPVS',
      country: 'BR',
      location: 'São Paulo',
      state: 'São Paulo',
      organization: 'weslley.io',
      organizationUnit: 'Open Source Development',
    },
    output: '/etc/ssl/private/cert.pem',
    rsa: 4096,
  },
  steps: {
    certificate: true,
  },
});
