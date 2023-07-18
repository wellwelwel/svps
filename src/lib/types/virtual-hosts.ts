export interface VirtualHostDefaults {
  /**
   * ### basic (easier)
   * Allows you to create a default `index.html` page for a **PHP** (**7.4** and **8.2**) or **Node.js** (**LTS**) server and an optional **MySQL** empty database.
   *
   * ---
   *
   * ### advanced (manual)
   * Allows you to create a completely customized server using your own **Docker Compose** file and upload all contents from the **Docker Compose** file root.
   *
   * - Requires **Docker** and **Docker Compose** knowledge
   */
  type: 'basic' | 'advanced';
  /** Ex.: `site.com` */
  domain: string;
  /** Local Port for this domain that will be exposed by Docker */
  port: number;
  /** Set `true` to create a "www" CNAME */
  www?: boolean;
}

export interface BasicVirtualHost extends VirtualHostDefaults {
  type: 'basic';
  /**
   * #### NODE (LTS)
   * Default: `node:lts-alpine`
   *
   * See: https://hub.docker.com/_/node/tags
   *
   * ---
   *
   * #### PHP 8.2
   * `wellwelwel/php:8-shared-based`
   *
   * See: https://hub.docker.com/r/wellwelwel/php/tags
   *
   * ---
   *
   * #### PHP 7.4
   * `wellwelwel/7-shared-based`
   *
   * See: https://hub.docker.com/r/wellwelwel/php/tags
   *
   * ---
   *
   * - You can use your own Docker images by using this Virtual Host in `advanced` mode 🧙🏻
   */
  language: 'PHP 7' | 'PHP 8' | 'NODE';
  /** Set a default `index.html` page at `/var/www/${domain}/public_html/index.html` */
  defaultPage?: string;
  /**
   * #### Accessing your database
   * - **host:** `db_${domain}` (ex.: `db_site.com`)
   * - **user:** `root` (always)
   * - **port:** `3306` (always)
   *
   * Then, your `database name` and `password` 🧙🏻
   */
  mysql?: {
    database: string;
    password: string;
    /** For external access, you can expose your database by proxying the default port `3306`, then access it using your **VPS** host and the exposed port */
    expose?: number;
  };
}

export interface AdvancedVirtualHost extends VirtualHostDefaults {
  type: 'advanced';
  /**
   * Set the **Docker Compose** file path for this domain.
   *
   * It will upload all local contents from **Docker Compose** file root via `SFTP` to this domain path: `/var/www/${domain}/`.
   */
  compose: string;
}

export type VIRTUAL_HOST = BasicVirtualHost | AdvancedVirtualHost;
