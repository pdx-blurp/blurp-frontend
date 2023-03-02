import { React, useEffect, useState, forwardRef, useMemo } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { BACKEND_URL, MODAL_VIEW } from '../constants/constants';

/*
Pulled the modal from an example here:
https://mui.com/material-ui/react-modal/#api
https://codesandbox.io/s/nw2r1e?file=/demo.tsx:221-423
*/

const LoadMapModal = forwardRef((props, ref) => {
  const [maps, setMaps] = useState();
  const [isLoading, setLoading] = useState(true);
  const [mapName, setMapName] = useState('');

  useEffect(() => {
    const id = props.profile.userID;
    let list = [];
    axios
      .post(BACKEND_URL + '/map', {
        userID: id,
      })
      .then((response) => {
        response.data.forEach((current) => {
          list.push([current.mapID, current.title]);
        });
        setMaps(
          list.map((value) => (
            <ListItem
              key={value[0]}
              disableGutters
              sx={{ width: '98%' }}
              className="my-3 rounded-lg bg-gray-50"
              secondaryAction={
                <div className="h-full">
                  <button
                    value={value[0]}
                    className="h-full rounded-l-lg bg-green-600 p-2 font-bold text-white hover:bg-green-900"
                    onClick={(e) => {
                      props.changeProfile(props.profile.userID, e.target.value, true);

                      ref.current.LoadFromDB(e.target.value);
                      handleClose();
                    }}>
                    Select
                  </button>
                  <button
                    value={value[0]}
                    className="h-full rounded-r-lg bg-red-600 p-2 font-bold text-white hover:bg-red-900"
                    onClick={(e) => {
                      deleteMap(props.profile, e.target.value);
                    }}>
                    Delete
                  </button>
                </div>
              }>
              <div className="mx-2">{value[1]}</div>
            </ListItem>
          ))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClose = (reason) => {
    /* // Prevents the user from clicking the outside of the modal on start
    if (!reason || (reason && props.profile.mapID != '')) {
      props.changeModal(false, [], MODAL_VIEW.START);
    } */
    props.changeModal(false, [], MODAL_VIEW.START);
  };

  const createNewMap = (props, mapName) => {
    const id = props.profile.userID;
    axios
      .post(BACKEND_URL + '/map/create', {
        userID: id,
        title: mapName,
      })
      .then((response) => {
        props.changeProfile(props.profile.userID, response.data.mapID, true);
        // Won't do anything if the graph being saved has no nodes
        ref.current.SaveToDB(response.data.mapID);
      })
      .catch((error) => {
        console.log(error);
      });
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
        setMaps(
          maps.filter((current) => {
            return current[0] != mapID;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const mapList = () => {
    if (!isLoading) {
      return <>{maps}</>;
    } else {
      <>
        <h1>Loading...</h1>
      </>;
    }
  };

  const selectView = (view) => {
    switch (view) {
      case MODAL_VIEW.START:
        return (
          <>
            <h1 className="text-center text-2xl text-black">Maps on your account</h1>
            <List
              sx={{ margin: '12px 0 12px 0' }}
              className="grid max-h-96 w-full grid-cols-1 justify-items-center overflow-auto rounded-lg bg-neutral-400">
              {mapList()}
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
                      props.changeProfile(props.profile.userID, props.profile.mapID, false);
                      handleClose();
                    }}>
                    Start a local session
                  </button>
                </p>
              </div>
            </form>
          </>
        );
      case MODAL_VIEW.SAVING:
        return (
          <>
            <h1 className="text-center text-2xl text-black">Save to your account</h1>
            <br />
            <form>
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
            </form>
          </>
        );
    }
  };

  return (
    <>
      <Modal
        open={props.modal.open}
        onClose={handleClose}
        disableEscapeKeyDown={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="load-map-modal">{selectView(props.modal.view)}</Box>
      </Modal>
    </>
  );
});

export default LoadMapModal;
1;
