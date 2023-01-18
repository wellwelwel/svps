export interface NODE {
   /**
    * 12, 14, 16, 18, 19...
    *
    * default: `18`
    */
   version?: number;
   /**
    * `npmjs` packages to install globally
    *
    * * To use `npx set domains` with `node`, it needs `pm2` as global package
    *
    * default: `[ 'pm2' ]`
    */
   packages?: string[];
}
