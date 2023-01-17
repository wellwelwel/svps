import { FTP, SFTP, CERTIFICATE, USER, MYSQL, MYSQL_ROOT } from '../lib/index.js';

export interface REQUIRED_FTP extends Required<FTP> {
   certificate: Required<CERTIFICATE>;
}

export interface REQUIRED_USER extends Required<USER> {
   /** Install `FTP` protocol using the `vsftpd` */
   ftp: REQUIRED_FTP | false;
   /** Enable `SFTP` protocol to the current user */
   sftp: Required<SFTP> | false;
}

export interface REQUIRED_MYSQL extends Required<MYSQL> {
   /** Creates root access */
   root: Required<MYSQL_ROOT>;
}
