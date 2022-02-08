const rexec = require('./secure-remote');

const SSH = (connection_options, cmds) => new Promise((resolve, reject) => rexec(connection_options.host, cmds, connection_options, err => !err ? resolve(true) : reject(err)));

module.exports = SSH;