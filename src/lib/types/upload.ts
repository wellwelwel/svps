export interface UPLOAD {
  /**
   * Path to local file or directory.
   *
   * For directories, it will upload every sub directories and their files.
   */
  local: string;
  /**
   * Absolute path to remote file or directory. It will ensure the remote path.
   *
   * ---
   *
   * Ex.: `/root/Documents/...`
   */
  remote: string;
  /**
   * List of file and directory names to ignore on upload.
   *
   * Insert names, not paths 🧙🏻
   *
   * ---
   *
   * @default
   * ```js
   * [
   *  '.git',
   *  'node_modules',
   *  '.Trashes',
   *  '.Spotlight-V100',
   *  '.DS_Store',
   *  'Icon',
   *  'Desktop.ini',
   *  ]
   * ``` */
  blacklist?: string[];
  /**
   * Set a custom permission for this Virutal Host.
   *
   * ---
   *
   * **A)** Only `user`
   * ```bash
   * chmod -R 0755 /var/containers/domains/${domain}
   * chown -R ${user} /var/containers/domains/${domain}
   * ```
   *
   * ---
   *
   * **B)** Only `group`
   * ```bash
   * chmod -R 0775 /var/containers/domains/${domain}
   * chown -R :${group} /var/containers/domains/${domain}
   * ```
   *
   * ---
   *
   * **C)** Both `user` and `group`
   * ```bash
   * chmod -R 0775 /var/containers/domains/${domain}
   * chown -R ${user}:${group} /var/containers/domains/${domain}
   * ```
   *
   * ---
   *
   * For custom permissions, please use `appendCommands`.
   */
  permissions?: {
    /**
     * This options won't create the user, in case it doesn't exists.
     *
     * You can easily create users using the `users` option from `npx svps mount`.
     */
    user?: string;
    /**
     * This options won't create the group, in case it doesn't exists.
     */
    group?: string;
  };
}
