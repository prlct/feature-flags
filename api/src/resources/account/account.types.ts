export type AuthAdminData = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  isEmailVerified: boolean;
  oauth?: {
    google?: boolean;
    github?:boolean;
  },
};
