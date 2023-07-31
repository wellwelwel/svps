import { REQUIRED_MYSQL } from '../../types/mysql.js';
import { MOUNT } from '../../types/mount.js';

export const setMysql = (configs: MOUNT): REQUIRED_MYSQL | null => {
  if (typeof configs?.mysql !== 'object') return null;
  if (typeof configs.mysql?.root !== 'object')
    throw 'The field `root` in `mysql` options is required';

  const mapMySQL = configs.mysql as REQUIRED_MYSQL;

  mapMySQL.root.name =
    typeof configs.mysql.root?.name === 'string'
      ? configs.mysql.root?.name
      : 'root';

  if (!configs.mysql?.users || !Array.isArray(configs.mysql?.users))
    mapMySQL.users = [];
  if (!configs.mysql?.databases || !Array.isArray(configs.mysql?.databases))
    mapMySQL.databases = [] as string[];

  for (const key in mapMySQL.users) {
    const user = mapMySQL.users[key];

    if (!user?.host)
      throw `The field \`host\` in \`mysql.users[${key}]\` is required`;
    if (!user?.name)
      throw `The field \`name\` in \`mysql.users[${key}]\` is required`;
    if (!user?.pass)
      throw `The field \`pass\` in \`mysql.users[${key}]\` is required`;
  }

  return mapMySQL;
};
