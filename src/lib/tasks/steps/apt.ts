import sh from '../../modules/sh.js';

export default () => [
  `echo "${sh.startTitle}Preparing the Environment${sh.endTitle}"`,
  'sudo apt-get update',
  'DEBIAN_FRONTEND="noninteractive" sudo apt -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade 2>/dev/null',
  'sudo apt-get autoremove -y --purge',
  'sudo apt-get clean -y',
  'sudo apt-get autoclean -y',
  sh.done,
];
