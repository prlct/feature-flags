export enum Env {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

type EnvData = {
  totalUsersCount: number
};

export type Application = {
  _id: string;
  companyId: string;
  publicApiKey: string;
  privateApiKey: string;
  featureIds: string[];
  envs: {
    [Env.DEVELOPMENT]: EnvData,
    [Env.STAGING]: EnvData,
    [Env.PRODUCTION]: EnvData,
  }
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
