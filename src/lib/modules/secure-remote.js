// ORIGINAL: https://github.com/tpresley/node-remote-exec/blob/master/index.js

const { Client } = require('ssh2');
const async = require('async');

const RemoteExec = (hosts, commands, options, cb) => {

   let stdout = process.stdout
      , stderr = process.stderr;

   // return an error if no hosts were specified
   if (!hosts || !(typeof hosts === 'string' || hosts instanceof Array)) return cb(new Error('No hosts specified'));
   // array-ify hosts if necessary
   if (typeof hosts === 'string') hosts = [hosts];
   // return an error if no commands were specified
   if (!commands || !(typeof commands === 'string' || commands instanceof Array)) return cb(new Error('No commands specified'));
   // array-ify commands if necessary
   if (typeof commands === 'string') commands = [commands];

   // if 3rd arg (options) is a function, assume the user skipped the options and specified the callback
   if (options instanceof Function) {

      cb = options;
      options = null;
   }

   // default options
   if (!options) options = {};
   if (!options.port) options.port = 22;

   // grab refs to overloaded outputs if specified (defaults to process.stdout and process.stderr)
   if (options.stdout && options.stdout.write instanceof Function) {

      stdout = options.stdout;
      delete options.stdout;
   }

   if (options.stderr && options.stderr.write instanceof Function) {

      stderr = options.stderr;
      delete options.stderr;
   }

   // set callback to noop if not provided
   if (!cb) cb = function () {};

   const doHost = (host, done) => {

      if (!(typeof host === 'string' || host.name)) done(new Error('Invalid Host'));
      if (typeof host === 'string') host = {name: host, host: host};

      // scoop up any parameters for substitution into commands
      let params = {}, param;

      if (options.params && options.params.hasOwnProperty) for (param in options.params) params[param] = String(options.params[param]);

      for (param in host) {

         if (host.hasOwnProperty(param)) params[param] = String(host[param]);
      }

      // grab a new connection object
      const connection = new Client;

      const connect = done => {

         // attach event listeners and start the connection
         options.host = host.name;
         connection.on('ready', done);
         connection.on('error', done);
         connection.connect(options);
      };

      const runCommands = done => {

         // run beforeEach callback for each host (if set)
         if (options.beforeEach && typeof options.beforeEach === 'function') options.beforeEach(host, commands, params);

         // run each command in series
         async.eachSeries(commands, runCommand, done);
      };

      const runCommand = (command, done) => {

         // if the current command ends with '&' (request for a background process)
         // then force an exit code of 0 to allow the connection to close
         // NOTE: this will most likely kill the command if it didn't specify 'nohup'
         if (/ &$/.test(command)) command = command + '; exit 0';

         // substitute parameters into the final command
         let param;
         for (param in params) command = command.replace(new RegExp('{{' + param + '}}'), params[param]);

         let missingParam;
         if (missingParam = /{{[a-zA-Z0-9_]+}}/.exec(command)) done(new Error('Missing parameter: ' + missingParam[0]));

         // run the current command
         connection.exec(command, (err, stream) => {

            if (err) done(err);

            // forward output to specified stream based on extended (null || stderr)
            stream.on('data', (data, extended) => ((extended && extended === 'stderr') ? stderr : stdout).write(data));

            // capture the end of the command and return error if command exited with non-zero code
            stream.on('exit', (code, signal) => {

               let err;

               if (code !== 0) err = new Error(host.name + ' : ' + command + ' [Exit ' + code + ']');

               done(err);
            });
         });
      };

      // 1: connect to current host
      // 2: run each command
      async.series([ connect, runCommands ], err => {

         // close the connection
         connection.end();

         // run afterEach callback for each host (if set)
         if (options.afterEach && typeof options.afterEach === 'function') options.afterEach(host, commands, params, err);

         done(err);
      });
   };

   // run commands on all hosts in parallel
   async.each(hosts, doHost, cb);
};

module.exports = RemoteExec;