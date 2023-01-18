export interface APACHE {
   /**
    * You can create a .html or .php file and set as default index.(html|php)
    *
    * default: `./index.html`
    */
   defaultPage?: string;
   /**
    * Instead of set domains like `[ "site.com", "www.site.com" ]`, set it to `true` to auto assign `www` cname
    *
    * default: `true`
    */
   www?: boolean;
   /**
    * Set to `false` to prevents your server from being accessed directly by IP
    *
    * default: `false`
    */
   accessFromIP?: boolean;
}
