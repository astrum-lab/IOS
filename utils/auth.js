import api from './api';
import {Read, Clean} from './storage/crud';

// @route POST api/login
// @desc Login user
// @access Public
export const login = async (email, password) => {
  const res = await api.post('/login', {email, password});
  return res.data;
};

// @route POST api/register
// @desc Register user
// @access Public
export const register = async (name, email, password) => {};

// @route GET api/user
// @desc Get user data
// @access Private

export const getUser = async () => {
  let user;
  try {
    const token = await Read('token');
    console.log(token);
    user = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
    Clean();
  }

  return user.data;
};
