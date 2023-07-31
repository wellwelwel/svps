import fs from 'fs';
import { VIRTUAL_HOST } from '../../types/virtual-hosts.js';

export const pastDomains: string[] = fs.existsSync('.svps/domains.json')
  ? JSON.parse(fs.readFileSync('.svps/domains.json', 'utf-8'))
  : [];

export const writeLogs = (virtualHosts: VIRTUAL_HOST[]) => {
  const newDomains = virtualHosts.map((virtualHost) => virtualHost.domain);

  if (newDomains.length === 0) return;

  const domains = JSON.stringify(
    Array.from<string>(new Set([...pastDomains, ...newDomains])),
    null,
    2
  );

  fs.mkdirSync('.svps', { recursive: true });
  fs.writeFileSync('.svps/domains.json', domains, {
    encoding: 'utf-8',
  });
};
