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
    * Set the mask from `0777`
    *
    * Ex.: `0077` defines the default permissions to `0700` and `0600`
    *
    * default: `0022`
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
   /** `FTP` protocol uses the `vsftpd` */
   ftp?: FTP | false;
   /** Enable `SFTP` protocol to the current user */
   sftp?: SFTP | false;
}

export interface REQUIRED_USER extends Required<USER> {
   sftp: Required<SFTP> | false;
   ftp: Required<FTP> | false;
}
