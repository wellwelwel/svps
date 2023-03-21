import { STEPS } from '../../types/steps.js';
import { input } from './index.js';

export const steps: Required<STEPS> = {
   repare: input?.steps && typeof input.steps?.repare === 'boolean' ? input.steps.repare : true,
   apt: input?.steps && typeof input.steps?.apt === 'boolean' ? input.steps.apt : true,
   firewall: input?.steps && typeof input.steps?.firewall === 'boolean' ? input.steps.firewall : true,
   users: input?.steps && typeof input.steps?.users === 'boolean' ? input.steps.users : true,
   certificate: input?.steps && typeof input.steps?.certificate === 'boolean' ? input.steps.certificate : true,
   apache: input?.steps && typeof input.steps?.apache === 'boolean' ? input.steps.apache : true,
   docker: input?.steps && typeof input.steps?.docker === 'boolean' ? input.steps.docker : true,
   php: input?.steps && typeof input.steps?.php === 'boolean' ? input.steps.php : true,
   node: input?.steps && typeof input.steps?.node === 'boolean' ? input.steps.node : true,
   mysql: input?.steps && typeof input.steps?.mysql === 'boolean' ? input.steps.mysql : true,
   crontab: input?.steps && typeof input.steps?.crontab === 'boolean' ? input.steps.crontab : true,
   desktop: input?.steps && typeof input.steps?.desktop === 'boolean' ? input.steps.desktop : false,
   appendCommands: input?.steps && typeof input.steps?.appendCommands === 'boolean' ? input.steps.appendCommands : true,
   reboot: input?.steps && typeof input.steps?.reboot === 'boolean' ? input.steps.reboot : true,
};
