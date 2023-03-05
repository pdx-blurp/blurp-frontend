import { React, useEffect, useState, useRef } from 'react';
import { MultiGraph } from 'graphology';
import {
  SigmaContainer,
  useRegisterEvents,
  ControlsContainer,
  SearchControl,
  useSigma,
} from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import { useCookies } from 'react-cookie';

import { v4 as uuidv4 } from 'uuid';
import {
  BACKEND_URL,
  CAMERA_MIN,
  CAMERA_MAX,
  COLORS,
  NODE_TYPE,
  SIDEBAR_VIEW,
  MODAL_VIEW,
  RELATIONSHIPS,
  STRESS_CODE,
  SIGMA_CURSOR,
  MAP_TOOLS,
} from '../constants/constants.ts';
import { NodeData, EdgeData } from '../constants/classes.jsx';
import DataSidebar from '../components/data_sidebar.jsx';
import MapToolbar from '../components/map_toolbar.jsx';
import System_Toolbar from '../components/system_toolbar.jsx';
import ConfirmDeleteForm from '../components/confirm_delete_form';
import TempMessage from '../components/temp_msg_display';
import LoadMapModal from '../components/select_map_modal';
import FileSaver from "file-saver";
import Sigma from "sigma";
import ForceSupervisor from "graphology-layout-force/worker";

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState('PERSON');
  const [color, setColor] = useState(COLORS.BROWN);
  const [name, setName] = useState('');
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Node');
  const [relationship, setRelationship] = useState(Object.keys(RELATIONSHIPS)[0]);
  const [node, setNode] = useState({ selected: new NodeData('', '', '', '', '') });
  const [edge, setEdge] = useState({ selected: new EdgeData('', '', '', '', '', '') });
  const [nodes, setNodes] = useState([]);
  const [node1, setNode1] = useState('');
  const [node2, setNode2] = useState('');
  const [sigmaCursor, setSigmaCursor] = useState(SIGMA_CURSOR.DEFAULT);
  const [mapToolbar, setMapToolbar] = useState(MAP_TOOLS.select);
  const [edgeData, setEdgeData] = useState({ familiarity: 0, stressCode: STRESS_CODE.MINIMAL });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [sigma, setSigma] = useState(null);
  const [clickTrigger, setClickTrigger] = useState(true);
  const child = useRef();
  // const [cookies, setCookie, removeCookie] = useCookies();
  const instance = axios.create({
    timeout: 1000,
  });

  // Used for the message box that pops up and notifys users of errors
  const [userNotification, setUserNotification] = useState('');
  const [isSidebarOn, setIsSidebarOn] = useState(false);
  const [mapTitle, setMapTitle] = useState('');
  const msgRef = useRef();

  // Temporary db userID/mapID for testing
  const [profile, setProfile] = useState({
    profileSet: true,
    userID: 'bb9e434a-7bb9-493a-80b6-abafd0210de3',
    // userID: '',
    mapID: '',
  });

  const [loadMapModal, setLoadMapModal] = useState({
    open: true,
    view: MODAL_VIEW.START,
    // When cookies are implemented, this will be default
    // view: MODAL_VIEW.NOTLOGGEDIN,
  });

  /* useEffect(() => {
    if (cookies.userID) {
      setProfile({
        ...profile,
        userID: cookies.userID,
      });

      setLoadMapModal({
        ...loadMapModal,
        view: MODAL_VIEW.START,
      });
    }
  }, [cookies]); */

  const changeModal = (state, view) => {
    setLoadMapModal({
      open: state,
      view: view,
    });
  };

  const changeProfile = (user, map, isSet) => {
    setProfile({
      profileSet: isSet,
      userID: user,
      mapID: map,
    });
  };

  const DBref = useRef({
    SaveToDB(mapID) {
      if (profile.profileSet && graph.order > 0) {
        graph.forEachNode((current, attr) => {
          if (current) {
            instance
              .post(BACKEND_URL + '/map/node/create', {
                userID: profile.userID,
                mapID: mapID,
                nodeinfo: {
                  nodeName: attr.label,
                  nodeID: current,
                  color: attr.color,
                  size: attr.size,
                  age: attr.years === '' ? 0 : attr.years,
                  type: attr.entity.toLowerCase(),
                  description: attr.notes,
                  pos: {
                    x: attr.x,
                    y: attr.y,
                  },
                },
              })
              .catch((error) => {
                if (error.response) {
                  console.log(
                    'Error: Invalid post request, status:' +
                      error.response.status +
                      '\n' +
                      error.response.headers
                  );
                } else if (error.request) {
                  console.log(
                    'Error: The server failed to respond to the post request\n' + error.message
                  );
                } else {
                  console.log(
                    'Error: Some error has occured\n' + 'error message:\n' + error.message
                  );
                }
              });
          }
        });
        graph.forEachEdge((current, attr, source, target, sourceAttr, targetAttr) => {
          if (current) {
            instance
              .post(BACKEND_URL + '/map/relationship/create', {
                mapID: mapID,
                relationshipinfo: {
                  relationshipID: current,
                  nodePair: {
                    nodeOne: source,
                    nodeTwo: target,
                  },
                  description: 'unused',
                  relationshipType: {
                    type: attr.label,
                    familiarity: attr.familiarity,
                    stressCode: attr.stressCode,
                    size: attr.size,
                  },
                },
              })
              .catch((error) => {
                if (error.response) {
                  console.log(
                    'Error: Invalid post request, status:' +
                      error.response.status +
                      '\n' +
                      error.response.headers
                  );
                } else if (error.request) {
                  console.log(
                    'Error: The server failed to respond to the post request\n' + error.message
                  );
                } else {
                  console.log(
                    'Error: Some error has occured\n' + 'error message:\n' + error.message
                  );
                }
              });
          }
        });
      }
    },
    LoadFromDB(mapID) {
      if (profile.profileSet) {
        instance
          .post(BACKEND_URL + '/map/get', {
            mapID: mapID,
          })
          .then((response) => {
            graph.clear();
            let nodeList = [];
            response.data.forEach((data) => {
              data.nodes.forEach((node) => {
                graph.addNode(node.nodeID, {
                  x: node.pos.x,
                  y: node.pos.y,
                  label: node.nodeName,
                  entity: node.type.toUpperCase(),
                  size: node.size,
                  years: node.age === 0 ? '' : node.age,
                  notes: node.description,
                  color: node.color,
                });
                nodeList = nodeList.concat({ id: node.nodeID, label: node.nodeName });
              });
              data.relationships.forEach((edge) => {
                graph.addEdgeWithKey(
                  edge.relationshipID,
                  edge.nodePair.nodeOne,
                  edge.nodePair.nodeTwo,
                  {
                    label: edge.relationshipType.type,
                    familiarity: edge.relationshipType.familiarity,
                    stressCode: edge.relationshipType.stressCode,
                    node1: '',
                    node2: '',
                    size: edge.relationshipType.size,
                    color: edgeColor(edge.relationshipType.stressCode),
                  }
                );
              });
            });
            setNodes(nodeList);
          })
          .catch((error) => {
            if (error.response) {
              console.log(
                'Error: Invalid get request, status:' +
                  error.response.status +
                  '\n' +
                  error.response.headers
              );
              msgRef.current.showMessage('Failed to load from cloud, bad request');
            } else if (error.request) {
              console.log(
                'Error: The server failed to respond to the get request\n' + error.message
              );
              msgRef.current.showMessage('Failed to load from cloud, server not responding');
            } else {
              console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
            }
          });
      }
    },
  });

  function changeNodeData(name, years, notes, id) {
    try {
      graph.setNodeAttribute(id, 'label', name);
      graph.setNodeAttribute(id, 'years', years);
      graph.setNodeAttribute(id, 'notes', notes);
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            return { ...node, label: name };
          }
          return node;
        })
      );
      if (profile.profileSet) {
        instance
          .patch(BACKEND_URL + '/map/node/update', {
            nodeID: id,
            mapID: profile.mapID,
            changes: {
              nodeName: name,
              age: years,
              description: notes,
            },
          })
          .catch((error) => {
            /* followed the link below for handling errors involving axios
            https://stackabuse.com/handling-errors-with-axios/ */
            if (error.response) {
              console.log(
                'Error: Invalid update request, status:' +
                  error.response.status +
                  '\n' +
                  error.response.headers
              );
              msgRef.current.showMessage('Changes not saved, bad request');
            } else if (error.request) {
              console.log(
                'Error: The server failed to respond to the update request\n' + error.message
              );
              msgRef.current.showMessage('Changes not saved, server not responding');
            }
          });
      }
    } catch (error) {
      console.log(
        'Error: Some error has occured\n' +
          'Node ID:' +
          id +
          '\n' +
          'error message:\n' +
          error.message
      );
    }
  }

  function changeEdgeData(category, familiarity, stressCode, node1ID, node2ID, id) {
    try {
      graph.setEdgeAttribute(id, 'label', category);
      graph.setEdgeAttribute(id, 'familiarity', familiarity);
      graph.setEdgeAttribute(id, 'stressCode', stressCode);
      graph.setEdgeAttribute(id, 'node1ID', node1ID);
      graph.setEdgeAttribute(id, 'node2ID', node2ID);
      graph.setEdgeAttribute(id, 'color', edgeColor(stressCode));

      if (profile.profileSet) {
        instance
          .patch(BACKEND_URL + '/map/relationship/update', {
            relationshipID: id,
            mapID: profile.mapID,
            changes: {
              relationshipType: {
                type: category,
                familiarity: familiarity,
                stressCode: stressCode,
              },
            },
          })
          .catch((error) => {
            /* followed the link below for handling errors involving axios
         https://stackabuse.com/handling-errors-with-axios/ */
            if (error.response) {
              console.log(
                'Error: Invalid Update Request, status:' +
                  error.response.status +
                  '\n' +
                  error.response.headers
              );
              msgRef.current.showMessage('Changes not saved, bad request');
            } else if (error.request) {
              console.log(
                'Error: The server failed to respond to the update request\n' + error.message
              );
              msgRef.current.showMessage('Changes not saved, server not responding');
            }
          });
      }
    } catch (error) {
      console.log(
        'Error: Some error has occured\n' + 'Edge id: ' + id + 'error message:\n' + error.message
      );
    }
  }

  /**
   * Triggers the user to download the map JSON as "map.blurp".
   */
  function downloadMapJson() {
    // Get the JSON data string
    let jsonDataString =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph.toJSON()));

    // Create the download link
    let downloadElement = document.createElement('a');
    downloadElement.download = `${mapTitle.trim()}.blurp`;
    downloadElement.href = jsonDataString;

    // Add the download link, click it, then remove it
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
  }

  /**
   * Triggers the user to upload the map JSON as a *.blurp file, which may replace the existing graph.
   */
  function uploadMapJson() {
    // Create the upload link
    let uploadElement = document.createElement('input');
    uploadElement.type = 'file';
    uploadElement.accept = '.blurp';
    uploadElement.multiple = false; // Only allow one map to be selected

    // Add the upload link, click it, then wait for file upload
    document.body.appendChild(uploadElement);
    uploadElement.click();

    // Listen for a change on file input (indicates the user confirmed a selection of file)
    uploadElement.addEventListener('change', (event) => {
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        // Convert to JSON
        const contents = event.target.result;
        let jsonDataString = JSON.parse(contents);

        // Ask user to confirm upload
        if (
          confirm(
            'Uploading a blurp map will replace the current map on-screen. Are you sure you want to continue?\nYou may want to cancel and export the current map first.'
          )
        ) {
          // Replace graph
          graph.clear();
          graph.import(jsonDataString);

          changeProfile(profile.userID, '', false);

          let nodeList = [];
          graph.forEachNode((current, attr) => {
            nodeList = nodeList.concat({ id: current, label: attr.label });
          });
          setNodes(nodeList);
        }
      };
      reader.readAsText(uploadedFile);
    });

    // Remove upload element now that we're done
    document.body.removeChild(uploadElement);
  }

  /**
   * Save the Sigma graph as a PNG file
   */
  function screenshotMap() {
    const container = document.getElementById("blurp-map-container");


    // const renderer = new Sigma(graph, container, {
    //   renderEdgeLabels: true,
    // });
    // renderer.setGraph(graph);
    const layout = new ForceSupervisor(graph);
    layout.start();


    const { width, height } = sigma.getDimensions();
    const pixelRatio = window.devicePixelRatio || 1;
    const tmpRoot = document.createElement("DIV");
    tmpRoot.style.width = `${width}px`;
    tmpRoot.style.height = `${height}px`;
    tmpRoot.style.position = "absolute";
    tmpRoot.style.right = "101%";
    tmpRoot.style.bottom = "101%";
    document.body.appendChild(tmpRoot);


    const tmpRenderer = new Sigma(sigma.getGraph(), tmpRoot, sigma.getSettings());
    //changed renderer --> sigma ^ and renderer.getSettings to sigma.getSettings


      // Copy camera and force to render now, to avoid having to wait the schedule /
    // debounce frame:
    tmpRenderer.getCamera().setState(sigma.getCamera().getState());
    tmpRenderer.refresh();


    // Create a new canvas, on which the different layers will be drawn:
    const canvas = document.createElement("CANVAS");
    canvas.setAttribute("width", width * pixelRatio + "");
    canvas.setAttribute("height", height * pixelRatio + "");
    const ctx = canvas.getContext("2d");


    // Draw a white background first:
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width * pixelRatio, height * pixelRatio);


    // For each layer, draw it on our canvas:
    const canvases = tmpRenderer.getCanvases();


    const layers = Object.keys(canvases);
    layers.forEach((id) => {
      ctx.drawImage(
        canvases[id],
        0,
        0,
        width * pixelRatio,
        height * pixelRatio,
        0,
        0,
        width * pixelRatio,
        height * pixelRatio,
      );
    });
    

    // Save the canvas as a PNG image:
    canvas.toBlob((blob) => {
      if (blob) FileSaver.saveAs(blob, "graph.png");


      // Cleanup:
      tmpRenderer.kill();
      tmpRoot.remove();
    }, "image/png");
    //renderer.kill();
  }

  function handleToolbarEvent(data) {
    if (data === MAP_TOOLS.node) {
      setModalTitle('Add Node');
      setMapToolbar(MAP_TOOLS.node);
    } else if (data === MAP_TOOLS.edge) {
      setModalTitle('Add Edge');
      setMapToolbar(MAP_TOOLS.edge);
    } else if (data === MAP_TOOLS.eraser) {
      setMapToolbar(MAP_TOOLS.eraser);
    } else {
      setMapToolbar(MAP_TOOLS.select);
    }
  }

  const edgeColor = (stressCode) => {
    if (stressCode == 1) return COLORS.BLUE;
    else if (stressCode == 2) return COLORS.GREEN;
    else if (stressCode == 3) return COLORS.YELLOW;
    else if (stressCode == 4) return COLORS.ORANGE;
    else return COLORS.RED;
  };

  function handleSubmit() {
    if (mapToolbar === MAP_TOOLS.node && sigma) {
      if (name == '') {
        msgRef.current.showMessage('Need to provide name for the node');
      } else {
        let camera = sigma.getCamera();
        let prevState = camera.previousState;
        if (graph.order < 4) {
          if (prevState.ratio > CAMERA_MAX - 1) {
            prevState.ratio = CAMERA_MAX;
          } else {
            prevState.ratio += 1.0;
          }
        }
        const id = uuidv4();
        graph.addNode(id, {
          x: pos.x,
          y: pos.y,
          label: name,
          entity: nodeType,
          size: size,
          years: '',
          notes: '',
          color: color,
        });
        setSize(Math.log(2) * 30);
        setNodes(nodes.concat({ id: id, label: name }));
        if (profile.profileSet) {
          instance
            .post(BACKEND_URL + '/map/node/create', {
              userID: profile.userID,
              mapID: profile.mapID,
              nodeinfo: {
                nodeName: name,
                nodeID: id,
                color: color,
                size: size,
                age: 0,
                type: nodeType.toLowerCase(),
                description: '',
                pos: {
                  x: pos.x,
                  y: pos.y,
                },
              },
            })
            .then((response) => {
              msgRef.current.showMessage(mapToolbar + ' was successfully created');
            })
            .catch((error) => {
              if (error.response) {
                console.log(
                  'Error: Invalid post request, status:' +
                    error.response.status +
                    '\n' +
                    error.response.headers
                );
                msgRef.current.showMessage('Node not created in cloud, bad request');
              } else if (error.request) {
                console.log(
                  'Error: The server failed to respond to the post request\n' + error.message
                );
                msgRef.current.showMessage('Node not created in cloud, server not responding');
              } else {
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
        } else {
          msgRef.current.showMessage(mapToolbar + ' was successfully created');
        }
      }
    } else {
      if (node1 == '' || node2 == '') {
        msgRef.current.showMessage('Need to select two nodes to attach an edge to');
      } else {
        const edgeExists = () => {
          for (const x of graph.edges(node1, node2)) {
            if (x) {
              return true;
            }
          }
          return false;
        };
        if (!edgeExists()) {
          const id = uuidv4();
          graph.addEdgeWithKey(id, node1, node2, {
            label: relationship,
            familiarity: edgeData.familiarity,
            stressCode: edgeData.stressCode,
            node1: '',
            node2: '',
            size: size,
            color: edgeColor(edgeData.stressCode),
          });
          if (profile.profileSet) {
            instance
              .post(BACKEND_URL + '/map/relationship/create', {
                mapID: profile.mapID,
                relationshipinfo: {
                  relationshipID: id,
                  nodePair: {
                    nodeOne: node1,
                    nodeTwo: node2,
                  },
                  description: 'unused',
                  relationshipType: {
                    type: relationship,
                    familiarity: edgeData.familiarity,
                    stressCode: edgeData.stressCode,
                    size: size,
                  },
                },
              })
              .then((response) => {
                msgRef.current.showMessage(mapToolbar + ' was successfully created');
              })
              .catch((error) => {
                if (error.response) {
                  console.log(
                    'Error: Invalid post request, status:' +
                      error.response.status +
                      '\n' +
                      error.response.headers
                  );
                  msgRef.current.showMessage('Edge not created in cloud, bad request');
                } else if (error.request) {
                  console.log(
                    'Error: The server failed to respond to the post request\n' + error.message
                  );
                  msgRef.current.showMessage('Edge not created in cloud, server not responding');
                } else {
                  console.log(
                    'Error: Some error has occured\n' + 'error message:\n' + error.message
                  );
                }
              });
          } else {
            msgRef.current.showMessage(mapToolbar + ' was successfully created');
          }
        } else {
          // setUserNotification('Edge already exists between those nodes');
          msgRef.current.showMessage('Edge already exists between those nodes');
        }
      }
    }

    //closes modal
    setIsModalOpen(false);
  }

  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();

    useEffect(() => {
      // Register the events
      registerEvents({
        // default mouse events
        doubleClick: (event) => {
          // Soln for preventing zooming in on a double click found here:
          // https://github.com/jacomyal/sigma.js/issues/1274
          event.preventSigmaDefault();
        },
        click: (event) => {
          if (clickTrigger === true) {
            if (isSidebarOn) {
              setIsSidebarOn(false);
            } else {
              const grabbed_pos = sigma.viewportToGraph(event);
              setPos({ x: grabbed_pos.x, y: grabbed_pos.y });
              if (mapToolbar === MAP_TOOLS.node || mapToolbar === MAP_TOOLS.edge) {
                if (mapToolbar === MAP_TOOLS.edge && graph.order < 2) {
                  msgRef.current.showMessage('Not enough nodes to add edges to');
                } else {
                  setIsModalOpen(true);
                }
              }
            }
          }
        },
        clickNode: (event) => {
          if (mapToolbar === MAP_TOOLS.eraser) {
            const id = event.node;
            graph.dropNode(id);
            //update nodes
            setNodes(
              nodes.filter((node) => {
                return node.id !== id;
              })
            );
            if (profile.profileSet) {
              // loop through the edges and delete each one connecting
              // to the deleted node
              // could rewrite this to filter based on source and target by
              // using the filterEdges iterator
              graph.forEachEdge((current, attr, source, target, sourceAttr, targetAttr) => {
                if (source == id || target == id) {
                  instance
                    .delete(BACKEND_URL + '/map/relationship/delete', {
                      data: {
                        mapID: profile.mapID,
                        relationshipID: current,
                      },
                    })
                    .catch((error) => {
                      if (error.response) {
                        console.log(
                          'Error: Invalid delete request, status:' +
                            error.response.status +
                            '\n' +
                            error.response.headers
                        );
                        msgRef.current.showMessage('Failed to delete node in cloud, bad request');
                      } else if (error.request) {
                        console.log(
                          'Error: The server failed to respond to the delete request\n' +
                            error.message
                        );
                        msgRef.current.showMessage(
                          'Failed to delete node in cloud, server not responding'
                        );
                      } else {
                        console.log(
                          'Error: Some error has occured\n' + 'error message:\n' + error.message
                        );
                      }
                    });
                }
              });
              instance
                .delete(BACKEND_URL + '/map/node/delete', {
                  data: {
                    mapID: profile.mapID,
                    nodeID: id,
                  },
                })
                .catch((error) => {
                  if (error.response) {
                    console.log(
                      'Error: Invalid delete request, status:' +
                        error.response.status +
                        '\n' +
                        error.response.headers
                    );
                    msgRef.current.showMessage('Failed to delete node in cloud, bad request');
                  } else if (error.request) {
                    console.log(
                      'Error: The server failed to respond to the delete request\n' + error.message
                    );
                    msgRef.current.showMessage(
                      'Failed to delete node in cloud, server not responding'
                    );
                  } else {
                    console.log(
                      'Error: Some error has occured\n' + 'error message:\n' + error.message
                    );
                  }
                });
            }
            //reenable the click trigger
            setClickTrigger(true);
          } else {
            // Done to clear data and avoid reopening old selections
            setNode({ selected: new NodeData('', '', '', '', '') });
            setEdge({ selected: new EdgeData('', '', '', '', '', '') });
            let retrieved = graph.getNodeAttributes(event.node);
            if (retrieved.entity === NODE_TYPE.PERSON) {
              child.current.changeView(SIDEBAR_VIEW.person);
            } else if (retrieved.entity === NODE_TYPE.PLACE) {
              child.current.changeView(SIDEBAR_VIEW.place);
            } else if (retrieved.entity === NODE_TYPE.IDEA) {
              child.current.changeView(SIDEBAR_VIEW.idea);
            }
            setNode({
              selected: new NodeData(
                retrieved.label,
                retrieved.years,
                retrieved.notes,
                retrieved.entity,
                event.node
              ),
            });
            setIsSidebarOn(true);
          }
        },
        clickEdge: (event) => {
          if (mapToolbar === MAP_TOOLS.eraser) {
            const id = event.edge;
            graph.dropEdge(id);
            if (profile.profileSet) {
              instance
                .delete(BACKEND_URL + '/map/relationship/delete', {
                  data: {
                    mapID: profile.mapID,
                    relationshipID: id,
                  },
                })
                .catch((error) => {
                  if (error.response) {
                    console.log(
                      'Error: Invalid delete request, status:' +
                        error.response.status +
                        '\n' +
                        error.response.headers
                    );
                    msgRef.current.showMessage('Failed to delete node in cloud, bad request');
                  } else if (error.request) {
                    console.log(
                      'Error: The server failed to respond to the delete request\n' + error.message
                    );
                    msgRef.current.showMessage(
                      'Failed to delete node in cloud, server not responding'
                    );
                  } else {
                    console.log(
                      'Error: Some error has occured\n' + 'error message:\n' + error.message
                    );
                  }
                });
            }
          } else {
            // Done to clear data and avoid reopening old selections
            setNode({ selected: new NodeData('', '', '', '', '') });
            setEdge({ selected: new EdgeData('', '', '', '', '', '') });
            let retrieved = graph.getEdgeAttributes(event.edge);
            child.current.changeView(SIDEBAR_VIEW.edge);
            setEdge({
              selected: new EdgeData(
                retrieved.label,
                retrieved.familiarity,
                retrieved.stressCode,
                retrieved.node1,
                retrieved.node2,
                event.edge
              ),
            });
            setIsSidebarOn(true);
          }
        },
        enterNode: (event) => {
          //once we enter a node, we do not want to trigger the click event. Only the clickNode.
          setClickTrigger(false);
        },
        leaveNode: (event) => {
          setClickTrigger(true);
        },
        enterEdge: (event) => {
          setClickTrigger(false);
        },
        leaveEdge: (event) => {
          setClickTrigger(true);
        },
      });
    }, [registerEvents]);

    return null;
  };

  return (
    //Sigma Graph Settings, reference graphology
    //Sigma inherits 100% of parent <div> width and height
    <div className="static h-screen w-screen overflow-hidden">
      <div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">{modalTitle}</h3>
                </div>
                {/*body*/}
                {modalTitle === 'Add Node' && (
                  <div className="relative flex-auto p-6">
                    <div>
                      <div>
                        <input
                          placeholder="Name"
                          type="text"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <br />
                      <div>
                        <label>Size</label>
                        <Slider
                          onChange={(e) => setSize(Math.log(e.target.value + 1) * 30)}
                          min={1}
                          max={10}
                          aria-label="small"
                          valueLabelDisplay="auto"
                        />
                      </div>
                      <br />
                      <div>
                        <select
                          type="text"
                          value={nodeType}
                          className="rounded text-center"
                          onChange={(e) => {
                            setNodeType(e.target.value);
                            switch (e.target.value) {
                              case NODE_TYPE.PERSON:
                                setColor(COLORS.BROWN);
                                break;
                              case NODE_TYPE.PLACE:
                                setColor(COLORS.GREY);
                                break;
                              case NODE_TYPE.IDEA:
                                setColor(COLORS.OLIVE);
                                break;
                            }
                          }}>
                          {Object.entries(NODE_TYPE).map(([key, value]) => (
                            <option key={key} value={value}>
                              {key}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {modalTitle === 'Add Edge' && (
                  <div className="relative flex-auto p-6">
                    <div>
                      <div>
                        <select
                          className="w-4/5 rounded text-center"
                          value={node1}
                          onChange={(e) => {
                            setNode1(e.target.value);
                          }}>
                          <option value="" disabled hidden>
                            Select Name
                          </option>
                          {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                              {node.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <select
                          value={node2}
                          className="w-4/5 rounded text-center"
                          onChange={(e) => {
                            setNode2(e.target.value);
                          }}>
                          <option value="" disabled hidden>
                            Select Name
                          </option>
                          {nodes
                            .filter((node) => node.id !== node1)
                            .map((node) => (
                              <option key={node.id} value={node.id}>
                                {node.label}
                              </option>
                            ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <select
                          type="text"
                          className="w-4/5 rounded text-center"
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}>
                          {Object.entries(RELATIONSHIPS).map(([relationship, value]) => (
                            <option key={relationship} value={value}>
                              {relationship}
                            </option>
                          ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <label>Edge Thickness</label>
                        <Slider
                          onChange={(e) => setSize(e.target.value * 2)}
                          min={1}
                          max={5}
                          aria-label="small"
                          valueLabelDisplay="auto"
                          sx={{ width: '75%' }}
                          className="mx-3"
                        />
                      </div>
                      <br />
                      <div>
                        <label>Familiarity</label>
                        <br />
                        <Slider
                          sx={{ width: '75%' }}
                          aria-label="Small"
                          name="edgeData.familiarity"
                          value={edgeData.familiarity}
                          valueLabelDisplay="auto"
                          onChange={(e) =>
                            setEdgeData({ ...edgeData, familiarity: e.target.value })
                          }
                          className="mx-3"
                        />
                      </div>
                      <br />
                      <div>
                        <label>Stress Level</label>
                        <br />
                        <select
                          name="edgeData.stressCode"
                          value={edgeData.stressCode}
                          className="rounded text-center"
                          onChange={(e) =>
                            setEdgeData({ ...edgeData, stressCode: e.target.value })
                          }>
                          <option value="1">1 - feeling good</option>
                          <option value="2">2 - feeling fine</option>
                          <option value="3">3 - feeling anxious</option>
                          <option value="4">4 - high stress/discomfort</option>
                          <option value="5">5 - very high stress</option>
                        </select>
                      </div>
                      <br />
                    </div>
                  </div>
                )}
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                  <button
                    className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={handleSubmit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SigmaContainer
        id="blurp-map-container"
        className={'flex w-full justify-center ' + sigmaCursor}
        style={{
          backgroundColor: '#f4f4f5',
        }}
        graph={graph}
        ref={setSigma}
        settings={{
          renderEdgeLabels: true,
          minCameraRatio: CAMERA_MIN,
          maxCameraRatio: CAMERA_MAX,
          autoScale: false,
        }}>
        <div className="mapTitle ">
          <label
            htmlFor="mapTitle"
            className=" sr-only text-sm font-medium text-gray-900 dark:text-white">
            Map Title
          </label>
          <div className="relative w-96">
            <input
              type="mapTitle"
              id="mapTitle"
              className=" w-full rounded-lg border bg-gray-300 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:text-black dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Map Title"
              required
              onChange={(e) => setMapTitle(e.target.value)}
            />
          </div>
        </div>
        <ControlsContainer className="absolute top-5 mt-6 w-[500px]" position="top-right">
          <SearchControl />
        </ControlsContainer>
        <GraphEvents />
      </SigmaContainer>
      <div className="absolute inset-y-0 right-0">
        <DataSidebar
          ref={child}
          node={node}
          edge={edge}
          changeNodeData={changeNodeData}
          changeEdgeData={changeEdgeData}
        />
      </div>
      <div className="absolute inset-y-0 left-0">
        <System_Toolbar
          ref={DBref}
          msgs={msgRef}
          modal={loadMapModal}
          profile={profile}
          changeModal={changeModal}
          screenshotMap={screenshotMap}
          download={downloadMapJson}
          upload={uploadMapJson}
        />
      </div>
      <div className="absolute inset-y-0 top-0 right-0">
        <MapToolbar handleToolbarEvent={handleToolbarEvent} setSigmaCursor={setSigmaCursor} />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <TempMessage message={userNotification} ref={msgRef} />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <ConfirmDeleteForm />
      </div>
      <div>
        <LoadMapModal
          profile={profile}
          modal={loadMapModal}
          // cookies={cookies}
          changeModal={changeModal}
          changeProfile={changeProfile}
          ref={DBref}
        />
      </div>
    </div>
  );
};

export default TestPage;
