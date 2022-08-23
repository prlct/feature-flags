export type Admin = {
  _id: string;

  issuer: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string | null;
  applicationIds: string[];

  lastRequestOn?: string;
  lastLoginOn: string;

  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
