export type User = {
  _id: string;

  issuer: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string | null;

  passwordHash: string;
  signupToken: string | null;
  resetPasswordToken?: string | null;
  
  lastRequestOn?: string;
  lastLoginOn: string;

  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
