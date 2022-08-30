import db from 'db';
import { securityUtil } from 'utils';
import moment from 'moment';
import { DATABASE_DOCUMENTS, INVITATION_TOKEN_SECURITY_LENGTH } from 'app.constants';

import schema from './invitation.schema';
import { Invitation, InvitationType } from './invitation.types';

const service = db.createService<Invitation>(DATABASE_DOCUMENTS.INVITATIONS, { schema });

const INVITATION_EXPIRATION_TIME_IN_DAYS = 7;

interface CreateMemberInvitation {
  companyId: string;
  email: string;
  adminId: string;
}

type CreateInvitation = CreateMemberInvitation & { type: InvitationType };

const createInvitation = async ({ companyId, email, adminId, type }: CreateInvitation) => {
  // TODO: Use token hash
  // TODO: Add collision check
  const token = securityUtil.generateSecureToken(INVITATION_TOKEN_SECURITY_LENGTH);
  const expirationOn = moment().add(INVITATION_EXPIRATION_TIME_IN_DAYS, 'd').toISOString();

  return service.insertOne({
    type,
    companyId,
    email,
    adminId,
    token,
    expirationOn,
  });
};

const createCompanyMemberInvitation = async ({ companyId, email, adminId }: CreateMemberInvitation) => {
  const invitationEntity = await createInvitation({
    companyId,
    email,
    adminId,
    type: InvitationType.COMPANY_MEMBER,
  });

  return invitationEntity;
};


// TODO: Add TTL index for invitations
const removeAdminInvitations = async ({ email, companyId } : { email: string, companyId: string }) => {
  return service.deleteSoft({ email, companyId, deletedOn: { $exists: false } });
};

export default Object.assign(service, {
  createCompanyMemberInvitation,
  removeAdminInvitations,
});

