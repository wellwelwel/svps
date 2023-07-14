export interface PHP {
  /**
   * 5.6, 7.4, 8.1, 8.2...
   *
   * default: `8.2`
   */
  version?: number;
  /**
   * Set PHP modules to install
   *
   * default:
   * ```js
   * [ 'cli', 'common', 'bz2', 'curl', 'gmp', 'readline', 'sqlite3', 'xml', 'bcmath', 'gd', 'imagick', 'imap', 'intl', 'json', 'mbstring', 'mysql', 'opcache', 'soap', 'tidy', 'xmlrpc', 'xsl', 'zip' ]
   * ```
   */
  modules?: string[];
  /**
   * Install the PHP `composer`
   *
   * default: `true`
   */
  composer?: boolean;
}
