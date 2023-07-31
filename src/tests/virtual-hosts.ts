import { SVPS, VirtualHost } from '../lib/index.js';

(async () => {
  try {
    const svps = new SVPS({
      access: {
        host: process.env?.HOST || '127.0.0.1',
        username: String(process.env.USER),
        password: process.env.PASS,
        port: Number(process.env.PORT) || 22,
      },
    });

    const virtualHosts: VirtualHost[] = [
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
            password: String(process.env.PASS),
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
            password: String(process.env.PASS),
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

    await svps.createVirtualHosts(virtualHosts);

    await svps.end();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
