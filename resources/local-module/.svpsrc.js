// @ts-check
import { defineConfig } from 'svps';

export default defineConfig({
  users: [
    {
      name: '',
      password: '',
      sudo: false,
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
  repair: true,
  apt: true,
  firewall: true,
  docker: false,
  desktop: false,
  reboot: true,
});
