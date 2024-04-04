import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Payload } from '../ts/interfaces';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const isMatchPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const generateToken = (userId: string): string => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret_key';
  const secretKey: string = TOKEN_SECRET;

  const token: string = jwt.sign({ userId } as Payload, secretKey, { expiresIn: '1h' });

  return token;
};
