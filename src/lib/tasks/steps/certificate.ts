import sh from '../../modules/sh.js';
import { setCertificate } from '../../modules/configs/certificate.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT) => {
  const certificate = setCertificate(configs);

  if (!certificate) return [] as string[];

  const {
    commonName,
    country,
    location,
    organization,
    organizationUnit,
    state,
  } = certificate.fields;

  const commands = [
    'echo "Generating Open SSL RSA Certificate..."',
    `--catch sudo openssl req -x509 -nodes -days ${certificate.days} -new -newkey rsa:${certificate.rsa} -keyout /etc/ssl/private/cert.pem -out /etc/ssl/private/cert.pem -subj "/C=${country}/ST=${state}/L=${location}/O=${organization}/OU=${organizationUnit}/CN=${commonName}"`,
    sh.done,
  ];

  return commands;
};
