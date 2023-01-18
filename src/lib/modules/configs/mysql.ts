import { REQUIRED_MYSQL } from '../../types/mysql.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const mysql: REQUIRED_MYSQL | null = (() => {
   if (!steps.mysql || typeof input?.mysql !== 'object') return null;
   if (typeof input.mysql?.root !== 'object') throw 'The field `root` in `mysql` options is required';

   const mapMySQL = input.mysql as REQUIRED_MYSQL;

   mapMySQL.root.name = typeof input.mysql.root?.name === 'string' ? input.mysql.root?.name : 'root';

   if (!input.mysql?.users || !Array.isArray(input.mysql?.users)) mapMySQL.users = [];
   if (!input.mysql?.databases || !Array.isArray(input.mysql?.databases)) mapMySQL.databases = [] as string[];

   for (const key in mapMySQL.users) {
      const user = mapMySQL.users[key];

      if (!user?.host) throw `The field \`host\` in \`mysql.users[${key}]\` is required`;
      if (!user?.name) throw `The field \`name\` in \`mysql.users[${key}]\` is required`;
      if (!user?.pass) throw `The field \`pass\` in \`mysql.users[${key}]\` is required`;
   }

   return mapMySQL;
})();
