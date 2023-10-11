import sh from '../../modules/sh.js';
import { MOUNT } from '../../types/mount.js';

const desktop: string[] = [
  `echo "${sh.startTitle}Setting up Xubuntu Desktop (It may take a while)${sh.endTitle}"`,
  `echo "Waiting 3 seconds to continue..."; sleep 3`,
  'sudo apt-get update',
  'sudo apt-get install software-properties-common -y',
  'echo | sudo add-apt-repository ppa:xubuntu-dev/staging',
  'sudo apt-get install -y tasksel xfce4 xfce4-terminal ubuntu-drivers-common gnome-software xfce4-goodies snapd',
  '--catch sudo tasksel install xubuntu-desktop || apt-get install xubuntu-desktop -y',
  '--catch sudo update-alternatives --install /usr/bin/x-session-manager x-session-manager /usr/bin/startxfce4 60',
  '--catch sudo update-alternatives --install /usr/bin/x-terminal-emulator x-terminal-emulator /usr/bin/xfce4-terminal 60',
];

const rdp: string[] = [
  `echo "${sh.startTitle}Setting up Remote Desktop (It may take a while)${sh.endTitle}"`,
  `echo "Waiting 3 seconds to continue..."; sleep 3`,

  /* Activate graphical display */
  '--catch sudo systemctl set-default graphical.target',

  /* Install RDP Remote */
  'sudo apt-get install xrdp xauth xserver-xorg-core xserver-xorg xorg openbox -y',

  `echo "${sh.startTitle}Setting up Remote Desktop (It may take a while)${sh.endTitle}"`,
  '--catch sudo systemctl enable xrdp',
  'sudo usermod -a -G ssl-cert xrdp',
  'sudo systemctl restart xrdp',
  '--reboot',
];

const xfce: string[] = [
  /** Prevent suspend and lock the sreen  */
  `--catch xfconf-query -c xfce4-screensaver -np '/lock/enabled' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-screensaver -np '/lock/saver-activation/enabled' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-screensaver -np '/saver/enabled' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/inactivity-on-ac' -t int -s 0`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/blank-on-ac' -t int -s 0`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/dpms-on-ac-sleep' -t int -s 0`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/dpms-on-ac-off' -t int -s 0`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/lock-screen-suspend-hibernate' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-power-manager -np '/xfce4-power-manager/dpms-enabled' -t 'bool' -s 'false'`,

  /** Logout settings */
  `--catch xfconf-query -c xfce4-session -np '/shutdown/ShowSuspend' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-session -np '/shutdown/LockScreen' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-session -np '/shutdown/ShowHibernate' -t 'bool' -s 'false'`,
  `--catch xfconf-query -c xfce4-session -np '/general/PromptOnLogout' -t 'bool' -s 'false'`,

  /** Minimal appearance */
  `--catch xfconf-query -c xfce4-desktop -np '/backdrop/screen0/monitorrdp0/workspace0/color-style' -t int -s 0`,
  `--catch xfconf-query -c xfce4-desktop -np '/backdrop/screen0/monitorrdp0/workspace0/image-style' -t int -s 0`,
  `--catch xfconf-query -c xfce4-desktop -np '/backdrop/screen0/monitorrdp0/workspace0/rgba1' -t double -s 0.184314 -t double -s 0.207843 -t double -s 0.258824  -t double -s 1.000000`,
  `--catch xfconf-query -c xfce4-desktop -np '/desktop-icons/tooltip-size' -t 'double' -s 48.000000`,
  `--catch xfconf-query -c xfwm4 -np '/general/workspace_count' -t int -s 1`,
  `--catch xfconf-query -c xfce4-panel -np '/panels/dark-mode' -t 'bool' -s 'true'`,
  `--catch xfconf-query -c xfce4-panel -np '/plugins/plugin-1/show-tooltips' -t 'bool' -s 'true'`,
  `--catch xfconf-query -c xfce4-panel -np '/plugins/plugin-2/grouping' -t int -s 1`,
  `--catch sudo apt-get remove colord -y`,
];

const browser: string[] = [
  'sudo apt-get update',
  'sudo apt-get update --fix-missing',
  '--catch sudo apt-get install firefox -y || true',
];

export default (configs: MOUNT) => {
  if (!configs.desktop) return [] as string[];

  return [...desktop, ...rdp, ...xfce, ...browser];
};
