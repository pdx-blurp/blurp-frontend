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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
        <Box sx={style}>
          <h2>Text</h2>
          <List sx={{ width: '100%' }}>
            {maps.map((value) => (
              <ListItem
                key={value}
                disableGutters
                secondaryAction={
                  <>
                    <IconButton
                      aria-label="comment"
                      value={value}
                      onClick={(e) => {
                        props.setProfile({
                          ...props.profile,
                          mapID: e.target.value,
                        });
                        ref.current.LoadFromDB(e.target.value);
                        handleClose();
                      }}>
                      O
                    </IconButton>
                    <IconButton
                      aria-label="comment"
                      value={value}
                      onClick={(e) => {
                        deleteMap(props.profile, e.target.value);
                        let tempMaps = maps;
                        const index = tempMaps.find((x) => x === e.target.value);
                        tempMaps.splice(index, 1);
                        setMaps(tempMaps);
                      }}>
                      X
                    </IconButton>
                  </>
                }>
                {value}
              </ListItem>
            ))}
          </List>
          <form>
            <input
              type="text"
              name="mapName"
              placeholder="Enter the name of a new map"
              className="textbox-sidebar"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
            />
            <button
              type="button"
              className="btn-sidebar"
              onClick={() => {
                createNewMap(props, mapName);
                handleClose();
              }}>
              Create new map
            </button>
            <button
              type="button"
              className="btn-sidebar"
              onClick={() => {
                props.setProfile({
                  ...props.profile,
                  profileSet: false,
                });
                handleClose();
              }}>
              Start a local session
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
});

export default LoadMapModal;
