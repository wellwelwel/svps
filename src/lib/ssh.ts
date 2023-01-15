import { Client, ConnectConfig } from 'ssh2';
import { dirname, resolve as pathResolve } from 'path';
import { VPS } from './modules/configs.js';

const ssh2 = new Client();

export const connect = (access: ConnectConfig): Promise<true> =>
   new Promise((resolve, reject) => {
      try {
         ssh2
            .on('error', (err) => {
               reject(err);
            })
            .connect(access)
            .on('ready', () => resolve(true))
            .on('end', () => resolve(true));
      } catch (error) {
         reject(error);
      }
   });

export const exec = (command: string): Promise<true> =>
   new Promise((resolve, reject) => {
      const errorTitle = (title: string) => `\x1b[0m\x1b[31m\x1b[1m${title}\x1b[0m`;
      const errorResponse = (response: any) => `\n  ${response}`;

      let executed = false;

      try {
         ssh2.exec(command, (err, stream) => {
            if (err) {
               reject(err);
               return;
            }

            stream
               .on('data', (data: any) => {
                  data && process.stdout.write(data);
               })
               .on('exit', (code: number) => {
                  if (code !== 0)
                     reject(
                        `${errorTitle('Exit code')}${errorResponse(code)}\n${errorTitle('Command')}${errorResponse(
                           command
                        )}`
                     );

                  resolve(true);
               })
               .stderr.on('data', (chunk: any) => {
                  if (!executed) {
                     process.stdout.write(`${errorTitle(`Remote error \x1b[2m[ ${VPS.host} ]`)}${errorResponse('')}`);
                     executed = true;
                  }

                  process.stdout.write(chunk);
               });
         });
      } catch (error) {
         reject(error);
      }
   });

/** Uses `SFTP` to upload a local file to remote server */
export const uploadFile = (
   localPath: string,
   remotePath: string,
   options?: {
      chmod?: {
         /** chmod of the file */
         file?: string;
         /** chmod of the file directory */
         directory?: string;
      };
      chown?: {
         user?: string;
         group?: string;
      };
   }
): Promise<true> =>
   new Promise(async (resolve, reject) => {
      try {
         ssh2.sftp(async (err, sftp) => {
            if (err) {
               reject(
                  '\x1b[31m\x1b[1mFailed to upload the file:\x1b[0m\x1b[31m check your remote SFTP connection.\x1b[0m\nYou can add "\x1b[33mSubsystem       sftp    internal-sftp\x1b[0m" in "\x1b[1m\x1b[4m/etc/ssh/sshd_config\x1b[0m" and then run `\x1b[33msystemctl restart ssh\x1b[0m` to restart the ssh service.'
               );
               return;
            }

            const resolvedPath = pathResolve(localPath);
            const remoteBasename = dirname(remotePath);

            if (remoteBasename?.trim().length > 0 && remoteBasename !== '/') await exec(`mkdir -p ${remoteBasename}`);

            sftp.fastPut(resolvedPath, remotePath, async (err) => {
               if (err) {
                  reject(err);
                  return;
               }

               const file =
                  options?.chmod?.file && options.chmod?.file?.trim().length > 0 ? options.chmod?.file : false || false;
               const directory =
                  options?.chmod?.directory && options.chmod?.directory?.trim().length > 0
                     ? options.chmod?.directory
                     : false || false;

               const user =
                  options?.chown?.user && options?.chown?.user?.trim().length > 0 ? options.chown.user : false || false;
               const group =
                  options?.chown?.group && options?.chown?.group?.trim().length > 0
                     ? options.chown.group
                     : false || false;

               if (directory) {
                  await exec(`chmod ${directory} ${remoteBasename}`);

                  if (user && group) await exec(`chown -R ${user}:${group} ${remoteBasename}`);
                  else if (user) await exec(`chown -R ${user} ${remoteBasename}`);
                  else if (group) await exec(`chown -R :${group} ${remoteBasename}`);
               }

               if (file) {
                  await exec(`chmod ${file} ${remotePath}`);

                  if (user && group) await exec(`chown ${user}:${group} ${remotePath}`);
                  else if (user) await exec(`chown ${user} ${remotePath}`);
                  else if (group) await exec(`chown :${group} ${remotePath}`);
               }

               resolve(true);
            });
         });
      } catch (error) {
         reject(error);
      }
   });

export const end = (): Promise<true> =>
   new Promise((resolve, reject) => {
      ssh2
         .on('error', (err) => {
            reject(err);
         })
         .on('end', () => resolve(true))
         .end();
   });
