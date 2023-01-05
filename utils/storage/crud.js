// make CRUD operations on the react-native-async-storage
//
// Path: utils/storage/crud.js
// Compare this snippet from App.js:
import AsyncStorage from '@react-native-async-storage/async-storage';

const Create = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

const Read = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(error);
  }
};

const Update = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

const Delete = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export {Create, Read, Update, Delete};
