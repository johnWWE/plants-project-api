/* eslint-disable no-unused-vars */
import { TokenIndexer } from 'morgan';
import { Request, Response } from 'express';

export type ConnectToMongoDB = (uri: string) => Promise<void>;

export type MorganConfigFunction = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => string;

export type GetAllUsersFunction = (req: Request, res: Response) => Promise<void>;
