import { STEPS } from '../../types/steps.js';
import { input } from './index.js';

export const steps: Required<STEPS> = {
  repair:
    input?.steps && typeof input.steps?.repair === 'boolean'
      ? input.steps.repair
      : false,
  apt:
    input?.steps && typeof input.steps?.apt === 'boolean'
      ? input.steps.apt
      : false,
  firewall:
    input?.steps && typeof input.steps?.firewall === 'boolean'
      ? input.steps.firewall
      : false,
  users:
    input?.steps && typeof input.steps?.users === 'boolean'
      ? input.steps.users
      : false,
  certificate:
    input?.steps && typeof input.steps?.certificate === 'boolean'
      ? input.steps.certificate
      : false,
  apache:
    input?.steps && typeof input.steps?.apache === 'boolean'
      ? input.steps.apache
      : false,
  docker:
    input?.steps && typeof input.steps?.docker === 'boolean'
      ? input.steps.docker
      : false,
  php:
    input?.steps && typeof input.steps?.php === 'boolean'
      ? input.steps.php
      : false,
  node:
    input?.steps && typeof input.steps?.node === 'boolean'
      ? input.steps.node
      : false,
  mysql:
    input?.steps && typeof input.steps?.mysql === 'boolean'
      ? input.steps.mysql
      : false,
  crontab:
    input?.steps && typeof input.steps?.crontab === 'boolean'
      ? input.steps.crontab
      : false,
  desktop:
    input?.steps && typeof input.steps?.desktop === 'boolean'
      ? input.steps.desktop
      : false,
  appendCommands:
    input?.steps && typeof input.steps?.appendCommands === 'boolean'
      ? input.steps.appendCommands
      : false,
  reboot:
    input?.steps && typeof input.steps?.reboot === 'boolean'
      ? input.steps.reboot
      : false,
};
