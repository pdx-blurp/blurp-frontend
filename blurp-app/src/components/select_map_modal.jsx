import { React, useEffect, useState, forwardRef } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { BACKEND_URL } from '../constants/constants';

/*
Temporary, pulled the modal from an example here:
https://mui.com/material-ui/react-modal/#api
https://codesandbox.io/s/nw2r1e?file=/demo.tsx:221-423

*/

const getMaps = (profile) => {
  const id = profile.profile.userID;
  let list = [];
  axios
    .post(BACKEND_URL + '/map', {
      userID: id,
    })
    .then((response) => {
      response.data.forEach((current) => {
        list.push(current.mapID);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });

  return list;
};

const createNewMap = (props, mapName) => {
  const id = props.profile.userID;
  axios
    .post(BACKEND_URL + '/map/create', {
      userID: id,
    })
    .then((response) => {
      props.setProfile({
        ...props.profile,
        mapID: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return null;
};

const deleteMap = (profile, mapID) => {
  const userID = profile.userID;
  axios
    .delete(BACKEND_URL + '/map/delete', {
      data: {
        mapID: mapID,
        userID: userID,
      },
    })
    .then((response) => {
      console.log('map deleted');
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const LoadMapModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(true);
  const [maps, setMaps] = useState(() => getMaps(props));
  const [mapName, setMapName] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="load-map-modal">
          <h1 className="text-center text-2xl text-black">Maps on your account</h1>
          <List className="max-h-96 w-full overflow-auto">
            {maps.map((value) => (
              <ListItem
                key={value}
                disableGutters
                className="my-3 rounded-lg bg-gray-50"
                secondaryAction={
                  <div className="h-full">
                    <button
                      value={value}
                      className="h-full rounded-l-lg bg-green-600 p-2 font-bold text-white hover:bg-green-900"
                      onClick={(e) => {
                        props.setProfile({
                          ...props.profile,
                          mapID: e.target.value,
                        });
                        ref.current.LoadFromDB(e.target.value);
                        handleClose();
                      }}>
                      Select
                    </button>
                    <button
                      value={value}
                      className="h-full rounded-r-lg bg-red-600 p-2 font-bold text-white hover:bg-red-900"
                      onClick={(e) => {
                        deleteMap(props.profile, e.target.value);
                        let tempMaps = maps;
                        const index = tempMaps.find((x) => x === e.target.value);
                        tempMaps.splice(index, 1);
                        setMaps(tempMaps);
                      }}>
                      Delete
                    </button>
                  </div>
                }>
                <div className="mx-2">{value}</div>
              </ListItem>
            ))}
          </List>
          <form>
            <div>
              <input
                type="text"
                name="mapName"
                placeholder="Enter the name of a new map"
                className="my-2 h-10 w-9/12 rounded-lg p-2"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
              />
              <button
                type="button"
                className="load-map-button float-right my-2 h-10 w-1/5"
                onClick={() => {
                  createNewMap(props, mapName);
                  handleClose();
                }}>
                Create new map
              </button>
            </div>
            <div>
              <p>
                Or, you could:
                <button
                  type="button"
                  className="load-map-button m-2 h-10 w-1/4"
                  onClick={() => {
                    props.setProfile({
                      ...props.profile,
                      profileSet: false,
                    });
                    handleClose();
                  }}>
                  Start a local session
                </button>
              </p>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
});

export default LoadMapModal;
1;
