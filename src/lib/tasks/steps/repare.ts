import sh from '../../modules/sh.js';

export default () => [
  `echo "${sh.startTitle}Repairing common Ubuntu errors${sh.endTitle}"`,

  /** Resolving `apt` conflicts */
  'rm -rf /var/lib/apt/lists/lock',
  'rm -rf /var/lib/dpkg/lock',
  'rm -rf /var/lib/dpkg/lock-frontend',
  'rm -rf /var/cache/apt/archives/lock',
  'echo "Y" | dpkg --configure -a',

  /** Resolving `/tmp` permissions */
  'chmod 1777 /tmp',

  /** Installing missing packages */
  'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
  'apt-get clean',
  'apt-get update --fix-missing',
  'apt-get install -f -y',

  /** Installing essential packages */
  'apt-get install -y apt-utils coreutils sysvinit-utils systemd systemd-sysv software-properties-common build-essential gcc g++ make dialog zip gzip tar unzip acl curl cron wget --no-install-recommends --no-install-suggests ssh',

  /** Installing essential libs */
  'apt-get install -y zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev',

  /** Fixing CVE-2022-39227 vunerability */
  'if dpkg -s python3-jwt >/dev/null 2>&1; then apt-get purge --autoremove -y python3-jwt; fi',

  /** Fixing CVE-2021-33503 vunerability */
  'if dpkg -s python3-urllib3 >/dev/null 2>&1; then apt-get purge --autoremove -y python3-urllib3; fi',

  /** Fixing CVE-2018-18074 vunerability */
  'if dpkg -s requests >/dev/null 2>&1; then apt-get purge --autoremove -y requests; fi',

  /** Fixing CVE-2022-23491 vunerability */
  'if dpkg -s certifi >/dev/null 2>&1; then apt-get purge --autoremove -y certifi; fi',

  /** Releasing the `dpkg` and `apt` */
  'echo "Y" | dpkg --configure -a',

  sh.done,
];
