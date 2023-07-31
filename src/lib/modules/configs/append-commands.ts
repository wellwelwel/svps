import { APPEND_COMMANDS } from '../../types/append-commands.js';
import { STEPS } from '../../types/steps.js';
import { svpsOptions } from '../../types/svps.js';

export const setAppendCommands = (
  configs: svpsOptions,
  steps: Required<STEPS>
): APPEND_COMMANDS | null => {
  return !steps.appendCommands || typeof configs?.appendCommands !== 'function'
    ? null
    : configs.appendCommands;
};
