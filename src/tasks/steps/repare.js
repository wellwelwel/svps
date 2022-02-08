const sh = require('../../modules/sh');

module.exports = () => [

   `echo "${sh.startTitle}Repairing common Ubuntu errors${sh.endTitle}"`,
   'rm -rf /var/lib/apt/lists/lock',
   'rm -rf /var/lib/dpkg/lock',
   'rm -rf /var/lib/dpkg/lock-frontend',
   'rm -rf /var/cache/apt/archives/lock',
   'echo "Y" | dpkg --configure -a',
   'chmod 1777 /tmp',
   'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
   'apt clean',
   'apt update --fix-missing',
   'apt install -f -y',
   'apt install software-properties-common dialog apt-utils zip gzip tar unzip acl -y',
   'echo "Y" | dpkg --configure -a',
   sh.done,
];