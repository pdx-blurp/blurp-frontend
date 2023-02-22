import { React, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import List from '@mui/material/List';
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

const LoadMapModal = (user) => {
  const [open, setOpen] = useState(false);
  const [maps, setMaps] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getMaps = () => {
    console.log(user.user);
    const id = user.user;
    axios
      .post(BACKEND_URL + '/map', {
        userID: id,
      })
      .then((response) => {
        console.log(response);
        return response.data[0].mapID;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <h2>Text</h2>
          {/* <p>{getMaps(user)}</p> */}
        </Box>
      </Modal>
    </>
  );
};

export default LoadMapModal;
