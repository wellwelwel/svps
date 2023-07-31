import { defineConfig } from 'svps';

export default defineConfig({
  users: [
    {
      name: 'support',
      password: '123',
      sudo: true,
      sftp: {
        chRoot: '/var/containers/',
        chUser: '/var/containers/domains',
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
      country: 'BR',
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
  crontab: {
    path: '../examples/crontab/crontab.sh',
    append: false,
  },
  steps: {
    repair: false,
    apt: false,
    firewall: false,
    users: true,
    certificate: false,
    apache: true,
    docker: true,
    php: false,
    node: false,
    mysql: false,
    crontab: true,
    reboot: false,
  },
});
