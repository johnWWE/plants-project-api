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

