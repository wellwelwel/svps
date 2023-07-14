// @ts-check
import { defineConfig } from 'svps';

export default defineConfig({
   access: [
      {
         host: '',
         username: 'root',
         password: '',
      },
   ],
   users: [
      {
         name: '',
         password: '',
         sudo: false,
         ftp: false,
         sftp: true,
      },
   ],
   apache: {
      accessFromIP: false,
   },
   php: {},
   node: {},
   mysql: {
      root: {
         pass: '',
      },
      users: [],
   },
   domains: './.domains.json',
   crontab: {
      path: './.cronjobs.sh',
   },
   steps: {
      repare: true,
      apt: true,
      firewall: true,
      users: true,
      certificate: false,
      apache: true,
      docker: true,
      php: false,
      node: false,
      mysql: false,
      crontab: true,
      desktop: false,
      appendCommands: true,
      reboot: true,
   },
   appendCommands: () => [],
});
