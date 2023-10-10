import { catchExec } from '../ssh.js';

export const basicPermissions = async (options: {
  remote: string;
  user?: string;
  group?: string;
}) => {
  const { remote, user, group } = options;

  if (user && group) {
    await catchExec(`sudo chown -R ${user}:${group} "${remote}"`);
    await catchExec(`sudo chmod -R 0775 "${remote}"`);
  } else if (user) {
    await catchExec(`sudo chown -R ${user}: "${remote}"`);
    await catchExec(`sudo chmod -R 0755 "${remote}"`);
  } else if (group) {
    await catchExec(`sudo chown -R :${group} "${remote}"`);
    await catchExec(`sudo chmod -R 0775 "${remote}"`);
  }
};
