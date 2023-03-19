import sh from '../../modules/sh.js';

export default () => [
   `echo "${sh.startTitle}Repairing common Ubuntu errors${sh.endTitle}"`,
   'rm -rf /var/lib/apt/lists/lock',
   'rm -rf /var/lib/dpkg/lock',
   'rm -rf /var/lib/dpkg/lock-frontend',
   'rm -rf /var/cache/apt/archives/lock',
   'echo "Y" | dpkg --configure -a',
   'chmod 1777 /tmp',
   'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
   'apt-get clean',
   'apt-get update --fix-missing',
   'apt-get install -f -y',
   'apt-get install apt-utils coreutils sysvinit-utils systemd software-properties-common build-essential gcc g++ make dialog zip gzip tar unzip acl curl ssh -y',
   'echo "Y" | dpkg --configure -a',
   sh.done,
];
