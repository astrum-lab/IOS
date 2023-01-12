import api from './api';
import {Read} from './storage/crud';

// orders
const getOrders = async page => {
  try {
    const token = await Read('token');
    const response = await api.get(`/orders?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// transfers
const getTransfers = async page => {
  try {
    const token = await Read('token');
    const response = await api.get(`/transfers?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// get user by wallet address
const getUserByWallet = async wallet => {
  try {
    const token = await Read('token');
    const response = await api.post(
      '/wallet',
      {address: wallet},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// transfer astrocoins
const postTransfer = async (wallet, astrocoin, message) => {
  try {
    const token = await Read('token');
    const response = await api.post(
      '/wallet/transfer',
      {
        wallet_to: wallet,
        amount: astrocoin,
        comment: message,
        type: '',
        title: '',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

export {getOrders, getTransfers, getUserByWallet, postTransfer};
