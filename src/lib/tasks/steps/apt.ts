import sh from '../../modules/sh.js';

export default () => [
   `echo "${sh.startTitle}Preparing the Environment${sh.endTitle}"`,
   'apt update',
   'DEBIAN_FRONTEND="noninteractive" apt -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade',
   'apt autoremove -y --purge',
   'apt clean',
   'apt autoclean',
   sh.done,
];
