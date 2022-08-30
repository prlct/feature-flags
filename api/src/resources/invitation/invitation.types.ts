export enum InvitationType {
  COMPANY_MEMBER = 'company_member',
}

export type Invitation = {
  _id: string;
  type: InvitationType,
  companyId: string;
  email: string;
  adminId: string;
  token: string;
  expirationOn: string;
  createdOn: string;
  updatedOn: string;
  deletedOn?: string;
};
