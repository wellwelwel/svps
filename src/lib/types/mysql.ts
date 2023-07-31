/** Creates root access */
export interface MYSQL_ROOT {
  /** Set the `root` password */
  pass: string;
  /**
   * Change name of `root` user in `MySQL`
   *
   * default: `root`
   */
  name?: string;
}

export interface MYSQL {
  root: MYSQL_ROOT;
  /** Creates `MySQL` users */
  users?: {
    host: string;
    name: string;
    pass: string;
  }[];
  /** Creates the empty `databases` */
  databases?: string[];
}

export interface REQUIRED_MYSQL extends Required<MYSQL> {
  root: Required<MYSQL_ROOT>;
}
