import { catchExec } from '../ssh.js';

export const basicPermissions = async (options: {
  remote: string;
  user?: string;
  group?: string;
}) => {
  const { remote, user, group } = options;

  if (user && group) {
    await catchExec(`chown -R ${user}:${group} "${remote}"`);
    await catchExec(`chmod -R 0775 "${remote}"`);
  } else if (user) {
    await catchExec(`chown -R ${user}: "${remote}"`);
    await catchExec(`chmod -R 0755 "${remote}"`);
  } else if (group) {
    await catchExec(`chown -R :${group} "${remote}"`);
    await catchExec(`chmod -R 0775 "${remote}"`);
  }
};
