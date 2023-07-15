import { defineConfig } from 'svps';

export default defineConfig({
  access: [
    {
      host: '127.0.0.1',
      username: 'root',
      password: 'root',
      port: 2222,
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
    appendCommands: true,
    reboot: true,
  },
  appendCommands: async () => ['echo "\n🍃 („• ᴗ •„) 🌸\n"'],
});
