import { steps } from '../../modules/configs/steps.js';
import sh from '../../modules/sh.js';

const desktop: string[] = [
  `echo "${sh.startTitle}Setting up Xubuntu Desktop (It may take a while)${sh.endTitle}"`,
  `echo "Waiting 3 seconds to continue..."; sleep 3`,
  'apt-get update',
  'apt-get install software-properties-common -y',
  'echo | add-apt-repository ppa:xubuntu-dev/staging',
  'apt-get install -y tasksel xfce4 xfce4-terminal ubuntu-drivers-common gnome-software xfce4-goodies snapd',
  '--catch tasksel install xubuntu-desktop || apt-get install xubuntu-desktop -y',
  'update-alternatives --install /usr/bin/x-session-manager x-session-manager /usr/bin/startxfce4 60',
  'update-alternatives --install /usr/bin/x-terminal-emulator x-terminal-emulator /usr/bin/xfce4-terminal 60',
];

const rdp: string[] = [
  `echo "${sh.startTitle}Setting up Remote Desktop (It may take a while)${sh.endTitle}"`,
  `echo "Waiting 3 seconds to continue..."; sleep 3`,

  /* Activate graphical display */
  '--catch systemctl set-default graphical.target',

  /* Install RDP Remote */
  'apt-get install xrdp xauth xserver-xorg-core xserver-xorg xorg openbox -y',

  `echo "${sh.startTitle}Setting up Remote Desktop (It may take a while)${sh.endTitle}"`,
  '--catch systemctl enable xrdp',
  'usermod -a -G ssl-cert xrdp',
  'systemctl restart xrdp',
  '--reboot',
];

const browser: string[] = [
  'apt-get update',
  'apt-get update --fix-missing',
  'apt-get install firefox -y || true',
];

export default () => {
  if (!steps.desktop) return [] as string[];

  return [...desktop, ...rdp, ...browser];
};
