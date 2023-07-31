/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { SVPS } from 'svps';
import { SVPS } from '../../lib/index.js';

const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: String(process.env.USER),
    password: process.env.PASS,
  },
});

await svps.mount({
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
});

await svps.end();
