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

export {getOrders, getTransfers};
