import { React, useEffect, useState, useRef } from 'react';
import { MultiGraph } from 'graphology';
import {
  SigmaContainer,
  useRegisterEvents,
  ControlsContainer,
  SearchControl,
  useSigma,
} from '@react-sigma/core';
import Sigma from 'sigma';
import getNodeProgramImage from 'sigma/rendering/webgl/programs/node.image';
import '@react-sigma/core/lib/react-sigma.min.css';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import PersonIcon from '../assets/person.svg';
import PlaceIcon from '../assets/place.svg';
import IdeaIcon from '../assets/idea.svg';

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
import { FAMILIARITY } from '../constants/constants';
import { capitalize } from '@mui/material';

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState(NODE_TYPE.PERSON);
  const [color, setColor] = useState(COLORS.PEOPLE);
  const [name, setName] = useState('');
  const [familiarity, setFamiliarity] = useState('Unfamiliar');
  const [edgeSize, setEdgeSize] = useState(10);
  const [nodeSize, setNodeSize] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Node');
  const [relationship, setRelationship] = useState(Object.keys(RELATIONSHIPS)[0]);
  const [node, setNode] = useState({ selected: new NodeData('', '', '', '', '') });
  const [edge, setEdge] = useState({ selected: new EdgeData('', '', '', '', '', '') });
  const [nodes, setNodes] = useState([]);
  const [node1, setNode1] = useState('');
  const [node2, setNode2] = useState('');
  const [sigmaCursor, setSigmaCursor] = useState(SIGMA_CURSOR.DEFAULT);
  const [sigmaClass, setSigmaClass] = useState('flex w-full justify-center');
  const [mapToolbar, setMapToolbar] = useState(MAP_TOOLS.select);
  const [draggedNode, setDraggedNode] = useState(null); // for allowing nodes to be dragged across map
  const [edgeData, setEdgeData] = useState({ familiarity: 0, stressCode: STRESS_CODE.MINIMAL });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [sigma, setSigma] = useState(null);
  const [clickTrigger, setClickTrigger] = useState(true);
  // Tell the user how to create an edge the first time they select the edge tool
  const [showEdgeMessage, setShowEdgeMessage] = useState(true);
  const child = useRef();
  const [cookies, setCookie, removeCookie] = useCookies();
  const instance = axios.create({
    timeout: 1000,
  });

  // Used for the message box that pops up and notifys users of errors
  const [isSidebarOn, setIsSidebarOn] = useState(false);
  const [mapTitle, setMapTitle] = useState('');
  const msgRef = useRef();

  // Temporary db sessionID/mapID for testing
  const [profile, setProfile] = useState({
    profileSet: false,
    // sessionID: 'bb9e434a-7bb9-493a-80b6-abafd0210de3',
    sessionID: '',
    mapID: '',
  });

  const [loadMapModal, setLoadMapModal] = useState({
    open: true,
    // view: MODAL_VIEW.START,
    // When cookies are implemented, this will be default
    view: MODAL_VIEW.NOTLOGGEDIN,
  });

  useEffect(() => {
    if (cookies.sessionID) {
      setProfile({
        ...profile,
        profileSet: true,
        sessionID: cookies.sessionID,
      });

      setLoadMapModal({
        ...loadMapModal,
        view: MODAL_VIEW.START,
      });
    }
  }, [cookies]);

  useEffect(() => {
    graph.setAttribute('name', mapTitle);
    if (profile.profileSet && profile.mapID != '') {
      instance
        .patch(BACKEND_URL + '/map/update', {
          sessionID: profile.sessionID,
          mapID: profile.mapID,
          changes: { title: graph.getAttribute('name') },
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
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
            console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
          }
        });
    }
  }, [mapTitle]);

  useEffect(() => {
    setSigmaClass('flex w-full justify-center ' + sigmaCursor);
  }, [sigmaCursor]);

  const changeModal = (state, view) => {
    setLoadMapModal({
      open: state,
      view: view,
    });
  };

  const changeProfile = (user, map, isSet) => {
    setProfile({
      profileSet: isSet,
      sessionID: user,
      mapID: map,
    });
  };

  const nodeTypeToColor = (nodeType) => {
    switch (nodeType) {
      case NODE_TYPE.PERSON:
        return COLORS.PEOPLE;
      case NODE_TYPE.PLACE:
        return COLORS.PLACE;
      case NODE_TYPE.IDEA:
        return COLORS.IDEA;
      default:
        return COLORS.PEOPLE;
    }
  };

  const nodeTypeToIconPath = (nodeType) => {
    switch (nodeType) {
      case NODE_TYPE.PERSON:
        return PersonIcon;
      case NODE_TYPE.PLACE:
        return PlaceIcon;
      case NODE_TYPE.IDEA:
        return IdeaIcon;
      default:
        return PersonIcon;
    }
  };

  // Reset a specific node's color to its default
  const resetNodeColor = (node) => {
    let nodeType = graph.getNodeAttribute(node, 'entity');
    graph.setNodeAttribute(node, 'color', nodeTypeToColor(nodeType));
  };

  // Reset the two selected nodes' colors
  const resetNodeColors = () => {
    if (node1) resetNodeColor(node1);
    if (node2) resetNodeColor(node2);
  };

  // Reset edge selection (user may have edges selected, reset)
  const resetEdgeSelection = () => {
    setNode1(null);
    setNode2(null);
    resetNodeColors();
  };

  const SaveToDB = (title) => {
    instance
      .post(BACKEND_URL + '/map/create', {
        sessionID: profile.sessionID,
        title: graph.getAttribute('name'),
      })
      .then((response) => {
        setProfile({
          ...profile,
          mapID: response.data.mapID,
          profileSet: true,
        });
        setMapTitle(title);
        if (graph.order > 0) {
          let nodes = [];
          let relationships = [];
          graph.forEachNode((current, attr) => {
            nodes.push({
              nodeName: attr.label,
              nodeID: current,
              color: nodeTypeToColor(attr.entity),
              size: attr.size,
              age: attr.years === '' ? 0 : attr.years,
              type: attr.entity.toLowerCase(),
              description: attr.notes,
              pos: {
                x: attr.x,
                y: attr.y,
              },
            });
          });
          graph.forEachEdge((current, attr, source, target, sourceAttr, targetAttr) => {
            relationships.push({
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
            });
          });

          instance
            .patch(BACKEND_URL + '/map/update', {
              mapID: response.data.mapID,
              sessionID: profile.sessionID,
              changes: {
                nodes: nodes,
                relationships: relationships,
              },
            })
            .catch((error) => {
              if (error.response) {
                console.log(
                  'Error: Invalid patch request, status:' +
                    error.response.status +
                    '\n' +
                    error.response.headers
                );
              } else if (error.request) {
                console.log(
                  'Error: The server failed to respond to the patch request\n' + error.message
                );
              } else {
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
        }
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
          console.log('Error: The server failed to respond to the post request\n' + error.message);
        } else {
          console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
        }
      });
  };

  const LoadFromDB = (mapID, profileSet) => {
    if (profileSet) {
      instance
        .post(BACKEND_URL + '/map/get', {
          mapID: mapID,
        })
        .then((response) => {
          graph.clear();
          let nodeList = [];
          response.data.forEach((data) => {
            setMapTitle(data.title);
            data.nodes.forEach((node) => {
              graph.addNode(node.nodeID, {
                x: node.pos.x,
                y: node.pos.y,
                label: node.nodeName,
                entity: node.type.toUpperCase(),
                size: node.size,
                years: node.age === 0 ? '' : node.age,
                notes: node.description,
                type: 'image',
                image: nodeTypeToIconPath(node.type.toUpperCase()),
                color: nodeTypeToColor(node.type.toUpperCase()),
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
            console.log('Error: The server failed to respond to the get request\n' + error.message);
            msgRef.current.showMessage('Failed to load from cloud, server not responding');
          } else {
            console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
          }
        });
    }
  };

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

  function changeEdgeData(category, familiarity, stressCode, node1ID, node2ID, id, edgeSize) {
    try {
      graph.setEdgeAttribute(id, 'label', category);
      graph.setEdgeAttribute(id, 'familiarity', familiarity);
      graph.setEdgeAttribute(id, 'stressCode', stressCode);
      graph.setEdgeAttribute(id, 'node1ID', node1ID);
      graph.setEdgeAttribute(id, 'node2ID', node2ID);
      graph.setEdgeAttribute(id, 'color', edgeColor(stressCode));
      graph.setEdgeAttribute(id, 'size', edgeSize);

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
    resetEdgeSelection();
    // Get the JSON data string
    let jsonDataString =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph.toJSON()));

    // Create the download link
    let downloadElement = document.createElement('a');
    downloadElement.download = mapTitle != '' ? `${mapTitle.trim()}.blurp` : `new map.blurp`;
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

          changeProfile(profile.sessionID, '', false);
          setMapTitle(graph.getAttribute('name'));
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

  function handleToolbarEvent(data) {
    resetEdgeSelection();
    if (data === MAP_TOOLS.person) {
      // setModalTitle('Add Node');
      setMapToolbar(MAP_TOOLS.person);
    } else if (data === MAP_TOOLS.place) {
      setMapToolbar(MAP_TOOLS.place);
    } else if (data === MAP_TOOLS.idea) {
      setMapToolbar(MAP_TOOLS.idea);
    } else if (data === MAP_TOOLS.edge) {
      setModalTitle('Add Edge');
      setMapToolbar(MAP_TOOLS.edge);
      // If this is their first time selecting edge tool, specify how to use
      if (showEdgeMessage) {
        msgRef.current.showMessage('Select two nodes to add an edge.');
        setShowEdgeMessage(false);
      }
    } else if (data === MAP_TOOLS.eraser) {
      setMapToolbar(MAP_TOOLS.eraser);
    } else if (data === MAP_TOOLS.move) {
      setMapToolbar(MAP_TOOLS.move);
    } else {
      setMapToolbar(MAP_TOOLS.select);
    }
  }

  const edgeColor = (stressCode) => {
    if (stressCode == 1) return COLORS.BLUE;
    else if (stressCode == 2) return COLORS.INDIGO;
    else if (stressCode == 3) return COLORS.PURPLE;
    else if (stressCode == 4) return COLORS.MAGENTA;
    else return COLORS.RED;
  };

  const getThicknessSize = (familiarityLabel) => {
    for (const [key, element] of Object.entries(FAMILIARITY)) {
      if (element.label === familiarityLabel) {
        return element.value;
      }
    }
    return 2;
  };

  function handleSubmit() {
    resetEdgeSelection();
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
          size: edgeSize,
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
                  size: edgeSize,
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
                msgRef.current.showMessage('Edge not created in cloud, bad request');
              } else if (error.request) {
                console.log(
                  'Error: The server failed to respond to the post request\n' + error.message
                );
                msgRef.current.showMessage('Edge not created in cloud, server not responding');
              } else {
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
        }
      } else {
        msgRef.current.showMessage('Edge already exists between these nodes');
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
              if (
                mapToolbar === MAP_TOOLS.person ||
                mapToolbar === MAP_TOOLS.place ||
                mapToolbar === MAP_TOOLS.idea
              ) {
                const newNodeSize = Math.log(nodeSize + 1) * 30;
                const id = uuidv4();
                graph.addNode(id, {
                  x: grabbed_pos.x,
                  y: grabbed_pos.y,
                  label: '',
                  entity: nodeType,
                  size: newNodeSize,
                  years: '',
                  notes: '',
                  type: 'image',
                  image: nodeTypeToIconPath(nodeType),
                  // color: color,
                  color: nodeTypeToColor(nodeType),
                });
                setNodes(nodes.concat({ id: id, label: name }));
                if (profile.profileSet) {
                  instance
                    .post(BACKEND_URL + '/map/node/create', {
                      sessionID: profile.sessionID,
                      mapID: profile.mapID,
                      nodeinfo: {
                        nodeName: name,
                        nodeID: id,
                        // color: color,
                        color: nodeTypeToColor(nodeType),
                        size: newNodeSize,
                        age: 0,
                        type: nodeType.toLowerCase(),
                        description: '',
                        pos: {
                          x: grabbed_pos.x,
                          y: grabbed_pos.y,
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
                        msgRef.current.showMessage('Node not created in cloud, bad request');
                      } else if (error.request) {
                        console.log(
                          'Error: The server failed to respond to the post request\n' +
                            error.message
                        );
                        msgRef.current.showMessage(
                          'Node not created in cloud, server not responding'
                        );
                      } else {
                        console.log(
                          'Error: Some error has occured\n' + 'error message:\n' + error.message
                        );
                      }
                    });
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
          } else if (mapToolbar === MAP_TOOLS.edge) {
            // This block occurs when the user is in 'edge' mode and clicks
            // on a node.
            // Done to clear data and avoid reopening old selections
            setNode({ selected: new NodeData('', '', '', '', '') });
            setEdge({ selected: new EdgeData('', '', '', '', '', '') });
            // If this is the first node selected, simply record this node
            if (node1 == null) {
              setNode1(event.node);
              graph.setNodeAttribute(event.node, 'color', 'yellow');
            }
            // Otherwise if this is the second node selected
            else {
              // Make sure it's not the same node
              if (node1 == event.node) {
                resetNodeColor(event.node);
                setNode1(null);
              } else {
                // If there's already a node between these two nodes, don't show modal
                let edgeExists = false;
                for (const x of graph.edges(node1, event.node)) {
                  if (x) {
                    edgeExists = true;
                  }
                }
                if (edgeExists) {
                  msgRef.current.showMessage('Edge already exists between those nodes');
                } else {
                  setNode2(event.node);
                  graph.setNodeAttribute(event.node, 'color', 'yellow');
                  setIsModalOpen(true);
                  setModalTitle('Add Edge');
                }
              }
            }
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
        downNode: (event) => {
          // react sigma guide for drag'n'drop:
          // https://sim51.github.io/react-sigma/docs/example/drag_n_drop/
          if (mapToolbar === MAP_TOOLS.move) {
            setDraggedNode(event.node);
            setSigmaCursor('cursor-move');
            graph.setNodeAttribute(event.node, 'highlighted', true);
          }
        },
        mousedown: (event) => {
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        mousemove: (event) => {
          if (draggedNode) {
            // commit that reveals camera enable/disable
            // https://github.com/jacomyal/sigma.js/commit/b7e45548d3dfdbfb8237a935db13b1c3baf88b6c
            sigma.getCamera().disable();
            const nodePosition = sigma.viewportToGraph(event);
            graph.setNodeAttribute(draggedNode, 'x', nodePosition.x);
            graph.setNodeAttribute(draggedNode, 'y', nodePosition.y);
          }
        },
        mouseup: (event) => {
          if (draggedNode) {
            setSigmaCursor('cursor-default');
            sigma.getCamera().enable();
            graph.removeNodeAttribute(draggedNode, 'highlighted');
            setDraggedNode(null);
            if (profile.profileSet) {
              const nodePosition = sigma.viewportToGraph(event);
              instance
                .patch(BACKEND_URL + '/map/node/update', {
                  nodeID: draggedNode,
                  mapID: profile.mapID,
                  changes: {
                    pos: {
                      x: nodePosition.x,
                      y: nodePosition.y,
                    },
                  },
                })
                .catch((error) => {
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
                  } else {
                    console.log(
                      'Error: Some error has occured\n' +
                        'Node ID:' +
                        draggedNode +
                        '\n' +
                        'error message:\n' +
                        error.message
                    );
                  }
                });
            }
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
                {modalTitle === 'Add Edge' && (
                  <div className="relative flex-auto p-6">
                    <div>
                      <div>
                        <label>Relationship Type</label>
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
                        <label>Familiarity Level</label>
                        <br />
                        <select
                          type="text"
                          value={familiarity}
                          className="w-4/5 rounded text-center"
                          onChange={(e) => {
                            setEdgeSize(getThicknessSize(e.target.value) * 2);
                            setFamiliarity(e.target.value);
                            setEdgeData({ ...edgeData, familiarity: e.target.value });
                          }}>
                          {Object.entries(FAMILIARITY).map(([key, value]) => (
                            <option key={key} value={value.label}>
                              {value.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <label>Stress Level</label>
                        <br />
                        <select
                          name="edgeData.stressCode"
                          value={edgeData.stressCode}
                          className="w-4/5 rounded text-center"
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
                    onClick={() => {
                      setIsModalOpen(false);
                      resetEdgeSelection();
                    }}>
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
        className={sigmaClass}
        style={{
          backgroundColor: '#f4f4f5',
        }}
        graph={graph}
        ref={setSigma}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: 'image',
          renderEdgeLabels: true,
          minCameraRatio: CAMERA_MIN,
          maxCameraRatio: CAMERA_MAX,
          autoScale: false,
        }}>
        <div className="mapTitle">
          <label
            htmlFor="mapTitle"
            className=" sr-only text-sm font-medium text-gray-900 dark:text-white">
            Map Title
          </label>
          <input
            type="mapTitle"
            id="mapTitle"
            name="mapTitle"
            className="titleBox"
            placeholder="Map Title"
            required
            value={mapTitle}
            onChange={(e) => setMapTitle(e.target.value)}
          />
          <ControlsContainer className="w-96" position="top-right">
            <SearchControl />
          </ControlsContainer>
        </div>
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
          SaveToDB={SaveToDB}
          LoadFromDB={LoadFromDB}
          msgs={msgRef}
          mapTitle={mapTitle}
          modal={loadMapModal}
          profile={profile}
          changeModal={changeModal}
          download={downloadMapJson}
          upload={uploadMapJson}
        />
      </div>
      <div className="absolute inset-y-0 top-0 right-0">
        <MapToolbar
          handleToolbarEvent={handleToolbarEvent}
          setSigmaCursor={setSigmaCursor}
          nodeType={nodeType}
          setNodeType={(type) => setNodeType(type)}
          nodeSize={nodeSize}
          setNodeSize={(size) => setNodeSize(size)}
        />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <TempMessage ref={msgRef} />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <ConfirmDeleteForm />
      </div>
      <div>
        <LoadMapModal
          SaveToDB={SaveToDB}
          LoadFromDB={LoadFromDB}
          profile={profile}
          modal={loadMapModal}
          mapTitle={mapTitle}
          // cookies={cookies}
          changeModal={changeModal}
          changeProfile={changeProfile}
          changeTitle={(title) => {
            setMapTitle(title);
            /* graph name is also being set here since SaveToDB
               doesn't see the change until one state change later */
            graph.setAttribute('name', title);
          }}
          clearGraph={() => {
            graph.clear();
          }}
        />
      </div>
    </div>
  );
};

export default TestPage;
