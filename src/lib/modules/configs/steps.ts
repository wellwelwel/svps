import { STEPS } from '../../types/steps.js';
import { svpsOptions } from '../../types/svps.js';

export const setSteps = (configs: svpsOptions): Required<STEPS> => {
  return {
    repair:
      configs?.steps && typeof configs.steps?.repair === 'boolean'
        ? configs.steps.repair
        : false,
    apt:
      configs?.steps && typeof configs.steps?.apt === 'boolean'
        ? configs.steps.apt
        : false,
    firewall:
      configs?.steps && typeof configs.steps?.firewall === 'boolean'
        ? configs.steps.firewall
        : false,
    users:
      configs?.steps && typeof configs.steps?.users === 'boolean'
        ? configs.steps.users
        : false,
    certificate:
      configs?.steps && typeof configs.steps?.certificate === 'boolean'
        ? configs.steps.certificate
        : false,
    apache:
      configs?.steps && typeof configs.steps?.apache === 'boolean'
        ? configs.steps.apache
        : false,
    docker:
      configs?.steps && typeof configs.steps?.docker === 'boolean'
        ? configs.steps.docker
        : false,
    php:
      configs?.steps && typeof configs.steps?.php === 'boolean'
        ? configs.steps.php
        : false,
    node:
      configs?.steps && typeof configs.steps?.node === 'boolean'
        ? configs.steps.node
        : false,
    mysql:
      configs?.steps && typeof configs.steps?.mysql === 'boolean'
        ? configs.steps.mysql
        : false,
    crontab:
      configs?.steps && typeof configs.steps?.crontab === 'boolean'
        ? configs.steps.crontab
        : false,
    desktop:
      configs?.steps && typeof configs.steps?.desktop === 'boolean'
        ? configs.steps.desktop
        : false,
    uploads:
      configs?.steps && typeof configs.steps?.uploads === 'boolean'
        ? configs.steps.uploads
        : false,
    appendCommands:
      configs?.steps && typeof configs.steps?.appendCommands === 'boolean'
        ? configs.steps.appendCommands
        : false,
    reboot:
      configs?.steps && typeof configs.steps?.reboot === 'boolean'
        ? configs.steps.reboot
        : false,
  };
};
