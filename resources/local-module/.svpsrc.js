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
   apache: {},
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
      certificate: true,
      apache: true,
      php: true,
      node: true,
      mysql: true,
      crontab: true,
      appendCommands: true,
      reboot: true,
   },
   appendCommands: () => [],
});
