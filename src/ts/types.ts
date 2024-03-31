/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { TokenIndexer } from 'morgan';
import { NextFunction, Request, Response } from 'express';

export type ConnectToMongoDB = (uri: string) => Promise<void>;

export type MorganConfigFunction = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => string;

export type FnControllers = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
