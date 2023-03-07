import { React, useEffect, useState, forwardRef, useMemo } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { BACKEND_URL, MODAL_VIEW } from '../constants/constants';
import GoogleLoginButton from './google_signin';

/*
Pulled the modal from an example here:
https://mui.com/material-ui/react-modal/#api
https://codesandbox.io/s/nw2r1e?file=/demo.tsx:221-423
*/

const LoadMapModal = forwardRef((props, ref) => {
  const [maps, setMaps] = useState();
  const [isLoading, setLoading] = useState(true);
  const [mapName, setMapName] = useState('');
  const [genList, setGenList] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    /* 
    Set up the map to wait until its ready by following the article below:
    https://codewithnico.com/react-wait-axios-to-render/ 
    */
    console.log("testing");
    if (props.profile.userID != '') {
      console.log("test")
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
          setMaps(list);
          setLoading(false);
        })
        .catch((error) => {
          let error_msg = '';
          let dev_error_msg = '';
          if (error.response && error.response.data) {
            /* Temporary; currently backend will report that the user wasn't found
               in the case that the user has no maps */
            if (error.response.data.error === 'Could not find user') {
              error_msg = 'No maps on account';
            } else {
              error_msg = error.response.data;
            }
            (dev_error_msg = 'status code: ' + error.response.status), error.response.data;
          } else if (error.request) {
            error_msg = 'Server not responding';
            dev_error_msg = error.request;
          } else {
            error_msg = 'failed to load maps, some error has occured';
            dev_error_msg = error;
          }
          console.log(dev_error_msg);
          setErrorMsg(error_msg);
          setLoading(false);
        });
    }
  }, [props.profile.profileSet, props.modal.open]);

  useEffect(() => {
    const list = mapList();
    setGenList(list);
  }, [maps, errorMsg]);

  const handleClose = (reason) => {
    /* // Prevents the user from clicking the outside of the modal on start
    if (!reason || (reason && props.profile.mapID != '')) {
      props.changeModal(false, [], MODAL_VIEW.START);
    } */
    props.changeModal(false, props.modal.view);
    setMapName('');
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
        if (mapID == profile.mapID) {
          props.clearGraph();
          props.changeProfile(props.profile.userID, '', false);
        }
        setMaps(
          maps.filter((current) => {
            return current[0] != mapID;
          })
        );
      })
      .catch((error) => {
        // Improve error handling here
        console.log(error);
      });
  };

  const mapList = () => {
    if (!isLoading && maps) {
      return (
        <>
          {maps.length > 0 ? (
            maps.map((value) => (
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
                        setMapName('');
                        props.LoadFromDB(e.target.value, true);
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
          ) : (
            <>
              <h1 className="text-2xl font-bold text-black">No maps on account</h1>
            </>
          )}
        </>
      );
    } else if (!isLoading) {
      return <h1 className="text-2xl font-bold text-black">{errorMsg}</h1>;
    } else {
      return (
        <>
          <h1>Loading...</h1>
        </>
      );
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
              className="grid max-h-96 w-full grid-cols-1 justify-items-center overflow-auto rounded-lg border border-neutral-400">
              {genList}
            </List>
            <form>
              <div>
                <input
                  type="text"
                  name="mapName"
                  placeholder="Enter the name of a new map"
                  className="my-2 h-10 w-9/12 rounded-lg p-2"
                  value={mapName}
                  required
                  onChange={(e) => setMapName(e.target.value)}
                />
                <button
                  type="submit"
                  className="load-map-button float-right my-2 h-10 w-1/5"
                  onClick={(e) => {
                    if (mapName != '') {
                      // Done to prevent title appearing in URL after submit
                      e.preventDefault();
                      props.clearGraph();
                      // props.changeTitle(mapName);
                      props.SaveToDB(mapName);
                      handleClose();
                    }
                  }}>
                  Create new map
                </button>
              </div>
              <div>
                <p>
                  Or, you could:
                  <button
                    type="submit"
                    className="load-map-button m-2 h-10 w-1/4"
                    onClick={(e) => {
                      if (mapName != '') {
                        e.preventDefault();
                        props.changeTitle(mapName);
                        props.changeProfile(props.profile.userID, props.profile.mapID, false);
                        handleClose();
                      }
                    }}>
                    Start a local session
                  </button>
                </p>
              </div>
            </form>
          </>
        );
      case MODAL_VIEW.NOTLOGGEDIN:
        return (
          <>
            <h1 className="my-2 text-center text-2xl text-black">Not logged in</h1>
            <p className="my-2">
              If you log in with your Google Account, you can access your maps from wherever, save
              multiple maps to your account, and more! However, you can start a local session if you
              don't want to log in. You will have to save your maps manually though!
            </p>
            <form>
              <GoogleLoginButton />
              <br />
              <input
                type="text"
                name="mapName"
                placeholder="Enter the name of a new map"
                className="my-2 h-10 w-8/12 rounded-lg p-2"
                value={mapName}
                required
                onChange={(e) => setMapName(e.target.value)}
              />
              <button
                type="submit"
                className="load-map-button float-right my-2 h-10 w-1/4"
                onClick={(e) => {
                  if (mapName != '') {
                    e.preventDefault();
                    props.changeTitle(mapName);
                    props.changeProfile(props.profile.userID, props.profile.mapID, false);
                    handleClose();
                  }
                }}>
                Start a local session
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
