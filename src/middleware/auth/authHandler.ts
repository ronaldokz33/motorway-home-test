import { expressjwt as jwt } from 'express-jwt';
import { Request } from 'express';

const getTokenInHeader = (req: Request) => {
  const { headers: { authorization } = {} } = req;

  if (!authorization) return '';
  if (authorization.split(' ').length !== 2) return '';

  const [tag, token] = authorization.split(' ');

  if (tag === 'Token' || tag === 'Bearer') return token;

  return '';
};

if (!process.env.JWT_SECRET)
  throw new Error('JWT_SECRET missing in environment.');

const authHandler = jwt({
  algorithms: ['HS256'],
  secret: process.env.JWT_SECRET,
  getToken: getTokenInHeader,
});

export default authHandler;
