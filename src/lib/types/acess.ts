import { ConnectConfig } from 'ssh2';

export interface ACCESS extends ConnectConfig {
  host: string;
  username: string;
}
