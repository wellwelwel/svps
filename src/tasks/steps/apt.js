const sh = require('../../modules/sh');

module.exports = () => [

   `echo "${sh.startTitle}Preparing the Environment${sh.endTitle}"`,
   'apt update',
   'apt upgrade -y',
   'apt autoremove -y --purge',
   'apt autoclean',
   sh.done,
];