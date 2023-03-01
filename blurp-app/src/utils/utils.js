import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';

const getMaps = (profile) => {
  const id = profile.userID;
  let list = [];
  axios
    .post(BACKEND_URL + '/map', {
      userID: id,
    })
    .then((response) => {
      response.data.forEach((current) => {
        list.push([current.mapID, current.title]);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });

  return list;
};

export default getMaps;