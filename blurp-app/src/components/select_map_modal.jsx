import { React, useEffect, useState } from 'react';
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

const getMaps = (user) => {
  const id = user.user;
  let list = [];
  axios
    .post(BACKEND_URL + '/map', {
      userID: id,
    })
    .then((response) => {
      response.data.forEach((current) => {
        console.log(current.mapID);
        list.push(current.mapID);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });

  return list;
};
const LoadMapModal = (user) => {
  const [open, setOpen] = useState(true);
  const [maps, setMaps] = useState(() => getMaps(user));
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
                  <IconButton
                    aria-label="comment"
                    value={value}
                    onClick={(e) => console.log(e.target.value)}>
                    O
                  </IconButton>
                }>
                {value}
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};

export default LoadMapModal;
