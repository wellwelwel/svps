import { createVirtualHosts } from 'svps';

const virtualHosts = [
  {
    domain: 'basic.node.com',
    port: 5000,
    www: true,
    server: {
      language: 'node',
      permissions: {
        user: 'wellwelwel',
      },
      mysql: {
        database: 'main',
        password: process.env.PASS,
        expose: 5001,
        isPublic: true,
      },
    },
  },
  {
    domain: 'basic.php.com',
    port: 5002,
    server: {
      language: 'php',
      mysql: {
        database: 'main',
        password: process.env.PASS,
        expose: 5003,
        isPublic: true,
      },
    },
  },
  {
    domain: 'advanced.com',
    port: 5004,
  },
];

(async () => {
  await createVirtualHosts({ virtualHosts });
})();
