import sh from '../../modules/sh.js';
import { setNode } from '../../modules/configs/node.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT) => {
  const node = setNode(configs);

  if (!node) return [] as string[];

  // source: https://github.com/nodesource/distributions
  const commands = [
    `echo "${sh.startTitle}Setting up Node.js${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get purge nodejs npm -y',
    'sudo rm -rf /etc/apt/sources.list.d/nodesource.list',
    'sudo rm -rf /etc/apt/keyrings/nodesource.gpg',
    'sudo apt-get install -y ca-certificates curl gnupg',
    'sudo mkdir -p /etc/apt/keyrings',
    'curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg',
    `echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${node.version}.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list > /dev/null`,
    'sudo apt-get update',
    'sudo apt-get install nodejs -y',
    'node -v',
    'echo "{}" | sudo tee package.json > /dev/null',
    'npm install --package-lock-only',
    'sudo npm i npm@latest -g 2>/dev/null',
  ];

  if (node.packages.length > 0)
    for (const module of node.packages) {
      Object.assign(commands, [
        ...commands,
        `echo "\n\x1b[0m\x1b[1m\x1b[36m‣ Global Module:\x1b[0m \x1b[22m\x1b[1m${module}\x1b[0m"`,
        `--catch sudo npm i ${module} -g`,
      ]);
    }

  if (node.packages.includes('pm2'))
    commands.push('--catch echo "\n"; pm2 startup');

  Object.assign(commands, [...commands, 'npm audit fix', sh.done]);

  return commands;
};
