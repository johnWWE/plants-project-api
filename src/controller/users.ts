import { Request, Response } from 'express';

import User from '../models/users';

import {UserDocument } from '../ts/interfaces'
import {GetAllUsersFunction} from '../ts/types'

export const fn_get_all_users: GetAllUsersFunction = async (req, res) => {
  try {
    let query: any = {};

    if (req.query.username) {
      query.name = { $regex: new RegExp(req.query.username as string, 'i') };
    }

    const users: UserDocument[] = await User.find(query);

    res.status(200).json({ users });
  } catch (error: any) {
    console.error('Error getting list of users: ', error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

type GetUserByIdFunction = (req: Request, res: Response) => Promise<void>;

export const fn_get_user_by_id: GetUserByIdFunction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ mensaje: 'User ID not provided' });
      return;
    }

    const users: UserDocument | null = await User.findById(id);

    if (!users) {
      res.status(404).json({ mensaje: 'User not found' });
      return;
    }

    res.status(200).json({ users });
  } catch (error: any) {
    console.error('Error getting user:', error);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

