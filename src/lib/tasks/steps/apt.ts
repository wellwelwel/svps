import sh from '../../modules/sh.js';

export default () => [
   `echo "${sh.startTitle}Preparing the Environment${sh.endTitle}"`,
   'apt-get update',
   'DEBIAN_FRONTEND="noninteractive" apt -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade 2>/dev/null',
   'apt-get autoremove -y --purge',
   'apt-get clean -y',
   'apt-get autoclean -y',
   sh.done,
];
