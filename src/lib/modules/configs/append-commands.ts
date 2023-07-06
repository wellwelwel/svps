import { input } from './index.js';
import { steps } from './steps.js';

export const appendCommands =
  !steps.appendCommands || typeof input?.appendCommands !== 'function' ? null : input.appendCommands;
