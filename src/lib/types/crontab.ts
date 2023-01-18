export interface CRONTAB {
   /**
    * Local path with the `crontab commands`
    *
    * default: `./.cronjobs.sh`
    */
   path?: string;
   /**
    * Keeps or reset previous `crontabs` and append new commands
    *
    * default: `false`
    */
   append?: boolean;
}
