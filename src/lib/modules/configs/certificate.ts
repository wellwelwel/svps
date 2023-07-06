import { REQUIRED_CERTIFICATE } from '../../types/certificate.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const certificate: REQUIRED_CERTIFICATE | null = (() => {
  if (!steps.certificate || typeof input?.certificate !== 'object') return null;

  const { certificate } = input;
  const emptyString = "''";

  return {
    days: certificate && typeof certificate?.days === 'number' ? certificate.days : 365,
    rsa: certificate && typeof certificate?.rsa === 'number' ? certificate.rsa : 4096,
    fields: {
      country:
        certificate && typeof certificate?.fields?.country === 'string' ? certificate.fields.country : emptyString,
      state: certificate && typeof certificate?.fields?.state === 'string' ? certificate.fields.state : emptyString,
      location:
        certificate && typeof certificate?.fields?.location === 'string' ? certificate.fields.location : emptyString,
      organization:
        certificate && typeof certificate?.fields?.organization === 'string'
          ? certificate.fields.organization
          : emptyString,
      organizationUnit:
        certificate && typeof certificate?.fields?.organizationUnit === 'string'
          ? certificate.fields.organizationUnit
          : emptyString,
      commonName:
        certificate && typeof certificate?.fields?.commonName === 'string'
          ? certificate.fields.commonName
          : emptyString,
    },
    output: certificate && typeof certificate?.output === 'string' ? certificate.output : '/etc/ssl/private/cert.pem',
  };
})();
