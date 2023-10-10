import { escapeQuotes } from '../../index.js';
import { importFile } from '../../modules/prepare-files.js';
import { rootSVPS } from '../../modules/root.js';
import sh from '../../modules/sh.js';

const getList = (version: string, arch: 'amd' | 'arm') => {
  const header = `if [[ "$(sudo grep -E '^VERSION_ID="${version}"' /etc/os-release)" ]] && [[ $(sudo dpkg --print-architecture) =~ ^${arch} ]]; then echo`;
  const main = escapeQuotes(
    importFile(`${rootSVPS}/resources/sources-list/${version}-${arch}.list`)
  );
  const footer = `| sudo tee /etc/apt/sources.list; fi`;

  return `${header} ${main} ${footer}`;
};

export default () => [
  `echo "${sh.startTitle}Repairing common Ubuntu errors${sh.endTitle}"`,

  /** Resolving `/tmp` permissions */
  'sudo chmod 1777 /tmp',

  /** Restoring default sources list */
  getList('18.04', 'amd'),
  getList('20.04', 'amd'),
  getList('22.04', 'amd'),
  getList('23.04', 'amd'),

  getList('18.04', 'arm'),
  getList('20.04', 'arm'),
  getList('22.04', 'arm'),
  getList('23.04', 'arm'),

  /** Installing missing packages */
  'sudo apt-get clean',
  'sudo apt-get update --fix-missing',
  'sudo apt-get install -f -y',

  /** Installing essential packages */
  'sudo apt-get install -y apt-utils coreutils sysvinit-utils systemd systemd-sysv software-properties-common build-essential gcc g++ make dialog zip gzip tar unzip acl curl cron wget --no-install-recommends --no-install-suggests ssh',

  /** Installing essential libs */
  'sudo apt-get install -y zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev',

  /** Fixing CVE-2022-39227 vulnerability */
  'if sudo dpkg -s python3-jwt >/dev/null 2>&1; then sudo apt-get purge --autoremove -y python3-jwt; fi',

  /** Fixing CVE-2021-33503 vulnerability */
  'if sudo dpkg -s python3-urllib3 >/dev/null 2>&1; then sudo apt-get purge --autoremove -y python3-urllib3; fi',

  /** Fixing CVE-2018-18074 vulnerability */
  'if sudo dpkg -s requests >/dev/null 2>&1; then sudo apt-get purge --autoremove -y requests; fi',

  /** Fixing CVE-2022-23491 vulnerability */
  'if sudo dpkg -s certifi >/dev/null 2>&1; then sudo apt-get purge --autoremove -y certifi; fi',

  /** Releasing the `dpkg` and `apt` */
  'echo "Y" | sudo dpkg --configure -a',

  sh.done,
];
