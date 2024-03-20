export interface DOWNLOAD {
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
}
