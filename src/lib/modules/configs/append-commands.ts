import { APPEND_COMMANDS } from '../../types/append-commands.js';
import { svpsOptions } from '../../types/svps.js';
import { setSteps } from './steps.js';

export const setAppendCommands = (
  configs: svpsOptions
): APPEND_COMMANDS | null => {
  const steps = setSteps(configs);

  return !steps.appendCommands || typeof configs?.appendCommands !== 'function'
    ? null
    : configs.appendCommands;
};
