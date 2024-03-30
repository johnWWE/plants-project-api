import User from '../models/users';

import { UserDocument, UserRole, QueryFilters } from '../ts/interfaces';
import { FnController, FnControllerResponse } from '../ts/types';

export const fn_get_all_users: FnController = async (req, res) => {
  try {
    const query: QueryFilters = {};

    if (req.query.username) {
      query.username = { $regex: new RegExp(req.query.username as string, 'i') };
    }

    const users: UserDocument[] = await User.find(query);

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error getting list of users: ', (error as Error).message);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};


export const fn_get_user_by_id: FnControllerResponse = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameter',
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: (error as Error).message,
    });
  }
};


export const create_user: FnControllerResponse = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password ) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const existingUser = await User.findOne({ email }).exec();

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const newUser = new User({
    username,
    email,
    password,
    role: UserRole.None,
  });


  try {
    const savedUser = await newUser.save();
    return res.status(201).json({
      success: true,
      data: savedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: (error as Error).message,
    });

  }

};
