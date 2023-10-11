import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setMysql } from '../../modules/configs/mysql.js';
import { MOUNT } from '../../types/mount.js';
import { rootSVPS } from '../../modules/root.js';

export default (configs: MOUNT) => {
  const mysql = setMysql(configs);

  if (!mysql) return [] as string[];

  const mysqld_cnf = `${rootSVPS}/resources/mysql/mysqld.cnf`;
  const my_cnf = `${rootSVPS}/resources/mysql/.my.cnf`;
  const temp_access = fs
    .readFileSync(normalize(my_cnf), 'utf-8')
    .replace(/{!USER}/gm, mysql.root.name)
    .replace(/{!PASS}/gm, mysql.root.pass);
  const commands = [
    `echo "${sh.startTitle}Setting up MySQL${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get install mysql-server -y',
    `echo ${escapeQuotes(
      fs.readFileSync(normalize(mysqld_cnf), 'utf-8')
    )} | sudo tee /etc/mysql/mysql.conf.d/mysqld.cnf > /dev/null`,
    `echo ${escapeQuotes(temp_access)} | sudo tee ~/.my.cnf > /dev/null`,
    'sudo chmod 0600 ~/.my.cnf',
    'sudo service mysql restart',
    `sudo mysql -e "ALTER USER '${mysql.root.name}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${mysql.root.pass}';"`,
    'sudo mysql -e "DELETE FROM mysql.user WHERE User=\'\';"',
    `sudo mysql -e "DELETE FROM mysql.user WHERE User='${mysql.root.name}' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"`,
    'sudo mysql -e "DROP DATABASE IF EXISTS test;"',
    "sudo mysql -e \"DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';\"",
  ];

  /* Creates users */
  for (const user of mysql.users) {
    Object.assign(commands, [
      ...commands,
      `sudo mysql -e "CREATE USER '${user.name}'@'${user.host}' IDENTIFIED WITH mysql_native_password BY '${user.pass}';" || echo "> No changes to ${user.name}@${user.host}"`,
      `sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO '${user.name}'@'${user.host}' WITH GRANT OPTION;"`,
    ]);
  }

  /* Creates databases */
  if (mysql.databases.length > 0) {
    for (const db of mysql.databases)
      Object.assign(commands, [
        ...commands,
        `sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${db};"`,
      ]);
  }

  Object.assign(commands, [
    ...commands,
    'sudo mysql -e "FLUSH PRIVILEGES;"',
    'echo "\x1b[36m"',
    'sudo mysql -e "SHOW DATABASES;"',
    'echo ""',
    'sudo mysql -e "SELECT user, host FROM mysql.user ORDER BY host ASC;" | sed "s/[[:space:]]/@/g"',
    'echo "\x1b[0m"',
    'sudo rm -rf ~/.my.cnf',
    'sudo service mysql restart',
    sh.done,
  ]);

  return commands;
};
