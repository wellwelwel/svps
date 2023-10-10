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
            user: 'support',
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
          permissions: {
            user: 'support',
          },
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

    const createVirtualHosts = await svps.createVirtualHosts(virtualHosts);

    await svps.commands([
      '--catch sudo docker compose -p basic_node_com -f /var/containers/compositions/basic_node_com.yml down',
      '--catch sudo docker compose -p basic_php_com -f /var/containers/compositions/basic_php_com.yml down',
      '--catch sudo docker rmi mysql:8-debian',
      '--catch sudo docker rmi node:lts-alpine',
      '--catch sudo docker rmi wellwelwel/php:8-shared-based',
    ]);

    await svps.end();

    if (createVirtualHosts !== true) process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
