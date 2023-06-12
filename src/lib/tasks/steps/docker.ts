import { steps } from '../../modules/configs/steps.js';
import sh from '../../modules/sh.js';

export default () => {
   if (!steps.docker) return [] as string[];

   return [
      `echo "${sh.startTitle}Installing Docker${sh.endTitle}"`,
      'apt-get update',
      'apt-get remove docker docker-engine docker.io containerd runc -y &> /dev/null || true',
      'apt-get install ca-certificates curl gnupg lsb-release -y',
      'mkdir -m 0755 -p /etc/apt/keyrings',
      'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg',
      'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null',
      'apt-get update',
      'apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y',
      'systemctl start docker > /dev/null',
      sh.done,
   ];
};
