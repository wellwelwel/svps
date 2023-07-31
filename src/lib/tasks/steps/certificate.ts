import sh from '../../modules/sh.js';
import { setCertificate } from '../../modules/configs/certificate.js';
import { svpsOptions } from '../../types/svps.js';
import { STEPS } from '../../types/steps.js';

export default (configs: svpsOptions, steps: Required<STEPS>) => {
  const certificate = setCertificate(configs, steps);

  if (!certificate || !steps.certificate) return [] as string[];

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
    `--catch openssl req -x509 -nodes -days ${certificate.days} -new -newkey rsa:${certificate.rsa} -keyout /etc/ssl/private/cert.pem -out /etc/ssl/private/cert.pem -subj "/C=${country}/ST=${state}/L=${location}/O=${organization}/OU=${organizationUnit}/CN=${commonName}"`,
    sh.done,
  ];

  return commands;
};
