import sh from '../../modules/sh.js';
import { BASIC_VIRTUAL_HOST } from '../../types/virtual-hosts.js';
import { createProxy } from './apache.js';
import { createBasicContainer } from './docker.js';

const whiteList = ['php', 'node'];

export const isBasic = (
  virtualHost: unknown
): virtualHost is BASIC_VIRTUAL_HOST => {
  if (
    !virtualHost ||
    typeof virtualHost !== 'object' ||
    !('server' in virtualHost) ||
    !virtualHost.server ||
    typeof virtualHost.server !== 'object'
  )
    return false;

  if (!('language' in virtualHost.server)) return false;

  if (
    typeof virtualHost.server.language !== 'string' ||
    !whiteList.includes(virtualHost.server.language)
  )
    return false;

  return true;
};

export const createBasicVirtualHost = (
  virtualHost: BASIC_VIRTUAL_HOST
): string[] => {
  const { port } = virtualHost;
  const apache = createProxy(virtualHost);
  const compose = createBasicContainer(virtualHost);
  const domain = String(virtualHost.domain).trim();

  const commands = [
    `echo "${sh.startTitle}Basic Server: ${domain} on port ${port}${sh.endTitle}"`,
  ];

  Object.assign(commands, [...commands, ...compose, ...apache, sh.done]);

  return commands;
};
