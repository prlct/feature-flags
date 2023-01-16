export type Admin = {
  _id: string;

  issuer?: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string | null;
  ownCompanyId: string;
  companyIds: string[];
  applicationIds: string[];
  stripeId: string | null;
  currentCompany: {
    _id: string,
    name: string,
  };
  permissions: {
    [key in string]: { // companyId
      manageSenderEmails: boolean,
      manageMembers: boolean,
      managePayments: boolean,
    };
  };

  lastRequestOn?: Date;
  lastLoginOn: Date;

  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;

  oauth?: {
    google?: boolean;
    github?:boolean;
  },
};
