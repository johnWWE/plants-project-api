import User from '../models/users';

import { UserDocument, UserRole, QueryFilters } from '../ts/interfaces';
import { FnController } from '../ts/types';

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

export const fn_get_user_by_id: FnController = async (req, res) => {
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
  } catch (error) {
    console.error('Error getting user:', (error as Error).message);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};

export const create_user: FnController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ mensaje: 'Missing required fields' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ mensaje: 'Email already in use' });
      return;
    }

    const newUser: UserDocument = new User({
      username,
      email,
      password,
      role: UserRole.None,
    });

    await newUser.save();

    res.status(201).json({ mensaje: 'User created successfully', usuario: newUser });
  } catch (error) {
    console.error('Error creating user:', (error as Error).message);
    res.status(500).json({ mensaje: 'Internal server error' });
  }
};
