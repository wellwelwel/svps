import sh from '../../modules/sh.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT) => {
  if (!configs.docker) return [] as string[];

  return [
    `echo "${sh.startTitle}Installing Docker${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get remove docker docker-engine docker.io containerd runc -y &> /dev/null || true',
    'sudo rm -f /etc/apt/keyrings/docker.gpg',
    'sudo apt-get install ca-certificates curl gnupg lsb-release -y',
    'sudo mkdir -m 0755 -p /etc/apt/keyrings',
    'curl -k -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --no-tty --dearmor -o /etc/apt/keyrings/docker.gpg',
    'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
    'sudo apt-get update',
    'sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y',
    'sudo systemctl start docker',
    'sudo systemctl restart docker',
    sh.done,
  ];
};
