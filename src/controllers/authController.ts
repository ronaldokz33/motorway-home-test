import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const createUserToken = (user: string): string => {
  if (!process.env.JWT_SECRET)
    throw new Error('JWT_SECRET missing in environment.');

  const tokenObject = { user: { username: user } };
  const userJSON = JSON.stringify(tokenObject);
  const token = jwt.sign(userJSON, process.env.JWT_SECRET);

  return token;
};

const Login = async (req: Request, res: Response) => {
  const { body: { user, password } = {} } = req;

  if (process.env.ADM_USER !== user || process.env.PASS_USER !== password)
    return res.status(401).json({ message: 'Invalid user' });

  return res.status(200).json({ token: createUserToken(user) });
};

export default Login;
