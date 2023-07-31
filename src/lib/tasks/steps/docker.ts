import sh from '../../modules/sh.js';
import { STEPS } from '../../types/steps.js';

export default (steps: Required<STEPS>) => {
  if (!steps.docker) return [] as string[];

  return [
    `echo "${sh.startTitle}Installing Docker${sh.endTitle}"`,
    'apt-get update',
    'apt-get remove docker docker-engine docker.io containerd runc -y &> /dev/null || true',
    'rm -f /etc/apt/keyrings/docker.gpg',
    'apt-get install ca-certificates curl gnupg lsb-release -y',
    'mkdir -m 0755 -p /etc/apt/keyrings',
    'curl -k -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --no-tty --dearmor -o /etc/apt/keyrings/docker.gpg',
    'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null',
    'apt-get update',
    'apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y',
    'systemctl start docker',
    'systemctl restart docker',
    sh.done,
  ];
};
