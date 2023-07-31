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
  steps: {
    repair: true,
    apt: true,
    firewall: true,
    users: true,
    certificate: false,
    apache: false,
    docker: false,
    php: false,
    node: false,
    mysql: false,
    crontab: false,
    desktop: false,
    reboot: true,
  },
  appendCommands: () => [],
});
