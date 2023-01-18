import sh from '../../modules/sh.js';
import { certificate } from '../../modules/configs/certificate.js';
import { steps } from '../../modules/configs/steps.js';

export default () => {
   if (!certificate || !steps.certificate) return [] as string[];

   const { commonName, country, location, organization, organizationUnit, state } = certificate.fields;

   const commands = [
      'echo "Generating Open SSL RSA Certificate..."',
      `if openssl req -x509 -nodes -days ${certificate.days} -new -newkey rsa:${certificate.rsa} -keyout /etc/ssl/private/cert.pem -out /etc/ssl/private/cert.pem -subj "/C=${country}/ST=${state}/L=${location}/O=${organization}/OU=${organizationUnit}/CN=${commonName}" 2>/dev/null; then echo true; else echo false; fi;`,
      sh.done,
   ];

   return commands;
};
