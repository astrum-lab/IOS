import api from './api';
import {Read, Create} from './storage/crud';

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
  await Read('token').then(async token => {
    const res = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user = res.data;
    Create('user', JSON.stringify(res.data));
  });

  return user;
};
