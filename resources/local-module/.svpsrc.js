// @ts-check
import { defineConfig } from 'svps';

export default defineConfig({
   vps: [
      {
         host: '',
         username: 'root',
         password: '',
      },
   ],
   users: [
      {
         name: 'user',
         password: '',
         sudo: false,
         directory: '/home/user',
         ftp: false,
         sftp: false,
      },
   ],
   apache: {},
   php: {},
   node: {},
   mysql: {
      root: {
         pass: '',
      },
      users: [
         {
            host: 'localhost',
            name: '',
            pass: '',
         },
      ],
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
