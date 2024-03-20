import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';
import { ACCESS } from './types/acess.js';
import path, { resolve as pathResolve } from 'path';

export const ssh2 = new Client();
export let SFTP: SFTPWrapper;

export const connect = (access: ConnectConfig): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      ssh2
        .on('error', (err) => {
          reject(err);
        })
        .connect(access)
        .on('ready', () => {
          ssh2.sftp((err, sftp) => {
            if (err) reject(err);
            else {
              SFTP = sftp;

              resolve(true);
            }
          });

          resolve(true);
        })
        .on('end', () => resolve(true));
    } catch (error) {
      reject(error);
    }
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
export const catchExec = (command: string): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      ssh2.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        stream
          .on('data', (data: any) => {
            if (data) {
              process.stdout.write('\x1b[0m\x1b[2m\x1b[3m');
              process.stdout.write(data);
            }
          })
          .on('exit', () => {
            resolve(true);
          })
          .stderr.on('data', (chunk: any) => {
            chunk &&
              process.stdout.write('\x1b[0m\x1b[2m\x1b[3m') &&
              process.stdout.write(chunk);
          });
      });
    } catch (error) {
      reject(error);
    }
  });

export const exec = (command: string, VPS?: ACCESS): Promise<true> =>
  new Promise((resolve, reject) => {
    const errorTitle = (title: string) =>
      `\x1b[0m\x1b[31m\x1b[1m${title}\x1b[0m`;
    const errorResponse = (response: any) => `\n\x1b[0m  \x1b[33m${response}`;

    let executed = false;

    try {
      ssh2.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        stream
          .on('data', (data: any) => {
            if (data) {
              process.stdout.write('\x1b[0m\x1b[2m\x1b[3m');
              process.stdout.write(data);
            }
          })
          .on('exit', (code: number) => {
            if (code !== 0)
              reject(
                `${errorTitle('Exit code')}${errorResponse(code)}\n${errorTitle(
                  'Command'
                )}${errorResponse(command)}`
              );

            resolve(true);
          })
          .stderr.on('data', (chunk: any) => {
            if (chunk && !executed) {
              if (VPS)
                process.stdout.write(
                  `${errorTitle(`\n\x1b[2m[ ${VPS.host} ]`)}${errorResponse(
                    ''
                  )}`
                );
              else
                process.stdout.write(
                  `${errorTitle('\nRemote error')}${errorResponse('')}`
                );
              executed = true;
            }

            chunk && process.stdout.write(chunk);
          });
      });
    } catch (error) {
      reject(error);
    }
  });
/* eslint-enable @typescript-eslint/no-explicit-any */

export const end = (): Promise<true> =>
  new Promise((resolve, reject) => {
    ssh2
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => resolve(true))
      .end();
  });

export const ensureDir = (remotePath: string): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      const path = remotePath?.trim() || '';

      if (path.length > 0 && path !== '/')
        exec(`mkdir -p "${path}"`).then(() => resolve(true));
    } catch (error) {
      reject(error);
    }
  });

/** Uses `SFTP` to upload a local file to remote server */
export const uploadFile = (
  localPath: string,
  remotePath: string
): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      const resolvedPath = pathResolve(localPath);

      SFTP.fastPut(resolvedPath, remotePath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });

/** Uses `SFTP` to download a local file to remote server */
export const downloadFile = (
  remotePath: string,
  localPath: string
): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      const resolvedPath = pathResolve(localPath);

      SFTP.fastGet(remotePath, resolvedPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        const remote = path.normalize(remotePath);
        const local = path.normalize(localPath);
        const message = `    \x1b[36m⌙ \x1b[0m\x1b[2m${remote} \x1b[36m▸\x1b[0m \x1b[0m\x1b[2m${local}\x1b[0m`;

        console.log(message);

        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
