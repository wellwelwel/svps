/**
 * Using a Docker Container to create a local VPS:
 * docker run -d --privileged -p 22:22 --restart always wellwelwel/vps:latest
 *
 * If you want test with Remote Desktop, changing `steps.desktop` to `true`:
 * docker run -d --privileged -p 22:22 -p 3389:3389 --restart always wellwelwel/vps:latest
 *
 * Or just put your own VPS access to test
 */

// @ts-check
import { defineConfig } from 'svps';

export default defineConfig({
   access: [
      {
         host: '127.0.0.1',
         username: 'root',
         password: 'root',
      },
   ],
   users: [
      {
         name: 'support',
         password: '123',
         sudo: true,
         sftp: {
            mask: '077',
         },
         ftp: {
            mask: '077',
         },
      },
      {
         name: 'manager',
         password: '456',
         sftp: {
            chRoot: '/var/www',
            chUser: '/var/www/domains',
         },
         ftp: {
            directory: '/var/www',
         },
         groups: ['www-data'],
      },
   ],
   apache: {},
   node: {
      version: 18,
      packages: ['yarn'],
   },
   mysql: {
      root: {
         pass: 'root',
      },
      databases: ['mydb'],
      users: [{ host: '127.0.0.1', name: 'manager', pass: '789' }],
   },
   certificate: {
      days: 365 * 3,
      fields: {
         commonName: 'My VPS',
         country: 'Brasil',
         location: 'São Paulo',
         state: 'São Paulo',
         organization: 'Open Source',
         organizationUnit: 'Development',
      },
   },
   php: {
      composer: true,
      version: 8.2,
   },
   steps: {
      repare: true,
      apt: true,
      firewall: true,
      users: true,
      certificate: true,
      apache: true,
      docker: true,
      php: true,
      node: true,
      mysql: true,
      crontab: true,
      desktop: false,
      appendCommands: true,
      reboot: true,
   },
   appendCommands: () => ['echo "\n🍃 („• ᴗ •„) 🌸\n"'],
});
