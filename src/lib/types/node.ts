export interface NODE {
  /**
   * 12, 14, 16, 18, 19...
   *
   * default: `18`
   */
  version?: number;
  /**
   * `npmjs` packages to install globally
   */
  packages?: string[];
}
