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
   'apt-get install apt-utils coreutils sysvinit-utils systemd systemd-sysv software-properties-common build-essential gcc g++ make dialog zip gzip tar unzip acl curl --no-install-recommends --no-install-suggests ssh -y',
   'if dpkg -s python3-jwt >/dev/null 2>&1; then apt-get purge --autoremove -y python3-jwt; fi',
   'if dpkg -s python3-urllib3 >/dev/null 2>&1; then apt-get purge --autoremove -y python3-urllib3; fi',
   'if dpkg -s requests >/dev/null 2>&1; then apt-get purge --autoremove -y requests; fi',
   'if dpkg -s certifi >/dev/null 2>&1; then apt-get purge --autoremove -y certifi; fi',
   'echo "Y" | dpkg --configure -a',
   'mkdir -p /etc/ssh/sshd_config.d/',
   sh.done,
];
