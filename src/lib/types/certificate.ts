/** Informations about the certificate (country, state, etc.) */
export interface CERTIFICATE_FIELDS {
  /**
   * Country Name (2 letter code). Ex.: [AU]
   *
   * default: `''`
   */
  country?: string;
  /**
   * State or Province Name (full name)
   *
   * default: `''`
   */
  state?: string;
  /**
   * Locality Name (eg, city)
   *
   * default: `''`
   */
  location?: string;
  /**
   * Organization Name (eg, company). Ex.: [Internet Widgits Pty Ltd]
   *
   * default: `''`
   */
  organization?: string;
  /**
   * Organizational Unit Name (eg, section)
   *
   * default: `''`
   */
  organizationUnit?: string;
  /**
   * Common Name (e.g. server FQDN or YOUR name)
   *
   * default: `''`
   */
  commonName?: string;
}

export interface CERTIFICATE {
  /**
   * Certificate validity days
   *
   * default: `365`
   */
  days?: number;
  /**
   * RSA cyptography strength
   *
   * minimum: `512`
   *
   * default: `4096`
   */
  rsa?: number;
  fields?: CERTIFICATE_FIELDS;
  /**
   * Output location to certificate file
   *
   * default: `/etc/ssl/private/cert.pem`
   */
  output?: string;
}

export interface REQUIRED_CERTIFICATE extends Required<CERTIFICATE> {
  fields: Required<CERTIFICATE_FIELDS>;
}
