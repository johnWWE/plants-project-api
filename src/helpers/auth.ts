import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Payload } from '../ts/interfaces';
import { Request } from 'express';
import { BadRequestError } from '../utils/customErrors';

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret_key';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword: string = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const isMatchPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const getUserIdFromToken = (token: string): string => {
  const payload: Payload = jwt.verify(token, TOKEN_SECRET) as Payload;

  return payload.userId;
};

const revokedTokens: Set<string> = new Set();

export const addToRevokedTokens = (token: string) => {
  revokedTokens.add(token);
};

export const isTokenRevoked = (token: string): boolean => {
  return revokedTokens.has(token);
};

export const generateToken = (userId: string): string => {
  const token: string = jwt.sign({ userId } as Payload, TOKEN_SECRET, { expiresIn: '2m' });
  return token;
};

export const isExpiredToken = (token: string): boolean => {
  const decodedToken: JwtPayload | null = jwt.decode(token, { complete: true }) as JwtPayload;

  if (!decodedToken) return true;

  const expiresIn: number = parseInt(decodedToken.payload.exp) - Math.floor(Date.now() / 1000);

  return expiresIn < 0;
};

export const verifyToken = (token: string): boolean | Error => {
  try {
    if (isExpiredToken(token)) throw BadRequestError('Token expired');
    jwt.verify(token, TOKEN_SECRET);
    return true;
  } catch (error) {
    return error as Error;
  }
};

export const getToken = (req: Request): string | Error => {
  try {
    const authToken: string | undefined = req.header('Authorization');

    if (!authToken) throw BadRequestError('Token not provided');

    const token: string | undefined = authToken.split(' ')[1];

    if (!token) throw BadRequestError('Incorrect token');

    const decodedToken: string | JwtPayload | null = jwt.decode(token);

    if (!decodedToken) throw BadRequestError('jwt malformed');

    const verifyTokenResult: boolean | Error = verifyToken(token);

    if (verifyTokenResult instanceof Error) throw verifyTokenResult;

    if (isTokenRevoked(token)) throw BadRequestError('Token revoked');

    return token;
  } catch (error) {
    return error as Error;
  }
};
