export interface SFTP {
   /**
    * Set the `ChrootDirectory`
    *
    * default: `/home`
    */
   chRoot?: string;
   /**
    * Set the user `SFTP` workspace
    *
    * default: `/home/%u`
    */
   chUser?: string;
   /**
    * Set the mask from `777` (directories) and `666` (files)
    *
    * Ex.: `077` defines the default permissions to `700` (directories) and `600` (files)
    *
    * default: `022` (directories: `755`, files: `644`)
    */
   mask?: string;
}

export interface FTP {
   /**
    * The default FTP root directory
    *
    * default: the same as setted in `user.directory`
    */
   directory?: string;
   /**
    * Set the mask from `777` (directories) and `666` (files)
    *
    * Ex.: `077` defines the default permissions to `700` (directories) and `600` (files)
    *
    * default: `022` (directories: `755`, files: `644`)
    */
   mask?: string;
}

export interface USER {
   /** Username to login */
   name: string;
   /** User password to login */
   password: string;
   /**
    * Default directory for the current user
    *
    * default: `/home/%u`
    */
   directory?: string;
   /**
    * Allows user to use "sudo" commands
    *
    * default: `false`
    */
   sudo?: boolean;
   /** Put the primary group as the first item */
   groups?: string[];
   /**
    * Enable `FTP` protocol to the current user
    *
    * ```js
    * export default {
    *    // ...
    *       // ...
    *          ftp: {
    *             directory: '/home/user',
    *             mask: '022',
    *          }
    *       }
    * ```
    */
   ftp?: FTP | boolean;
   /**
    * Enable `SFTP` protocol to the current user
    *
    * ```js
    * export default {
    *    // ...
    *       // ...
    *          sftp: {
    *             chRoot: '/home',
    *             chUser: '/home/user',
    *             mask: '022',
    *          }
    *       }
    * ```
    */
   sftp?: SFTP | boolean;
}

export interface REQUIRED_USER extends Required<USER> {
   sftp: Required<SFTP> | false;
   ftp: Required<FTP> | false;
}
