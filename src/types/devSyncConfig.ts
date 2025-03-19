export enum BackendTypeEnum {
  LOCAL = "local",
  GIT = "git",
  S3 = "s3",
}

export interface DevSyncConfig {
  dotfiles: string[];
  backupDir: string;
  backend: BackendTypeEnum;
  encrypt: boolean;
}
