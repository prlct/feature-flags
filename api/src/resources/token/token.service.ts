import db from 'db';
import { securityUtil } from 'utils';
import { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH } from 'app.constants';

import schema from './token.schema';
import { Token, TokenType } from './token.types';

const service = db.createService<Token>(DATABASE_DOCUMENTS.TOKENS, { schema });

const createToken = async (adminId: string, type: TokenType) => {
  const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

  return service.insertOne({
    type, value, adminId,
  });
};

const createAuthTokens = async ({
  adminId,
}: { adminId: string }) => {
  const accessTokenEntity = await createToken(adminId, TokenType.ACCESS);

  return {
    accessToken: accessTokenEntity.value,
  };
};

const findTokenByValue = async (token: string) => {
  const tokenEntity = await service.findOne({ value: token });

  return tokenEntity && {
    adminId: tokenEntity.adminId,
  };
};

// TODO: Add TTL index for auth tokens
const removeAuthTokens = async (accessToken: string) => {
  return service.deleteMany({ value: { $in: [accessToken] } });
};

export default Object.assign(service, {
  createAuthTokens,
  findTokenByValue,
  removeAuthTokens,
});
