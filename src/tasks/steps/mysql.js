const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const config = require(`${process.cwd()}/.svpsrc.js`);
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   if (!config?.SQL) return [];

   const { SQL } = config;
   const root_path = `${__dirname}../../../..`;
   const mysqld_cnf = `${root_path}/resources/mysql/mysqld.cnf`;
   const my_cnf = `${root_path}/resources/mysql/.my.cnf`;
   const temp_access = fs.readFileSync(normalize(my_cnf), 'utf-8').replace(/{!USER}/gm, SQL.root.name).replace(/{!PASS}/gm, SQL.root.pass);
   const sub_steps = [

      `echo "${sh.startTitle}Setting up MySQL${sh.endTitle}"`,
      'apt install mysql-server -y',
      `echo ${escapeQuotes(fs.readFileSync(normalize(mysqld_cnf), 'utf-8'))} | cat > /etc/mysql/mysql.conf.d/mysqld.cnf`,
      `echo ${escapeQuotes(temp_access)} | cat > ~/.my.cnf`,
      'chmod 0600 ~/.my.cnf',
      'service mysql restart',
      `mysql -e "ALTER USER '${SQL.root.name}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${SQL.root.pass}';"`,
      'mysql -e "DELETE FROM mysql.user WHERE User=\'\';"',
      `mysql -e "DELETE FROM mysql.user WHERE User='${SQL.root.name}' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"`,
      'mysql -e "DROP DATABASE IF EXISTS test;"',
      'mysql -e "DELETE FROM mysql.db WHERE Db=\'test\' OR Db=\'test\\_%\';"',
   ];

   /* Creates users */
   for (const user of SQL.users) {

      Object.assign(sub_steps, [

         ...sub_steps,
         `mysql -e "CREATE USER '${user.name}'@'${user.ip}' IDENTIFIED BY '${user.pass}';" || echo "> No changes to ${user.name}@${user.ip}"`,
         `mysql -e "GRANT ALL PRIVILEGES ON *.* TO '${user.name}'@'${user.ip}' WITH GRANT OPTION;"`,
      ]);
   }

   /* Creates databases */
   for (const db of SQL.databases) {

      Object.assign(sub_steps, [

         ...sub_steps,
         `mysql -e "CREATE DATABASE IF NOT EXISTS ${db};"`,
      ]);
   }

   Object.assign(sub_steps, [

      ...sub_steps,
      'mysql -e "FLUSH PRIVILEGES;"',
      'echo "\x1b[36m"',
      'mysql -e "SHOW DATABASES;"',
      'echo ""',
      'mysql -e "SELECT user, host FROM mysql.user ORDER BY host ASC;" | sed "s/[[:space:]]/@/g"',
      'echo "\x1b[0m"',
      'rm -rf ~/.my.cnf',
      'service mysql restart',
   ]);

   sub_steps.push(sh.done);

   return sub_steps;
};