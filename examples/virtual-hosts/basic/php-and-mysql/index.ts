/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 -p 5001:5001 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
// import { createVirtualHosts } from 'svps';
import { createVirtualHosts } from '../../../../lib/index.js';

await createVirtualHosts({
  /** PHP 8.2 */
  virtualHosts: [
    {
      domain: 'site.com',
      port: 5000,
      www: true,
      server: {
        language: 'php',
        mysql: {
          database: 'myLocalDB',
          password: '1234',
          expose: 5001,
          isPublic: true,
        },
        permissions: {
          user: 'my-user',
        },
      },
    },
  ],
});
