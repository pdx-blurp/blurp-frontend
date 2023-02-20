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

import { v4 as uuidv4 } from 'uuid';
import {
  CAMERA_MIN,
  CAMERA_MAX,
  COLORS,
  NODE_TYPE,
  SIDEBAR_VIEW,
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
import MapModal from '../components/select_map_modal';

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState('PERSON');
  const [color, setColor] = useState(COLORS.BROWN);
  const [name, setName] = useState('');
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Node');
  const [relationship, setRelationship] = useState(Object.keys(RELATIONSHIPS)[5]);
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

  // Used for the message box that pops up and notifys users of errors
  const [userNotification, setUserNotification] = useState('');
  const msgRef = useRef();

  // Temporary db userID/mapID for testing
  const userID = 'bb9e434a-7bb9-493a-80b6-abafd0210de3';
  const mapID = '71328e4f-15b6-4189-99a5-dca424b1fea8';

  const DBref = useRef({
    SaveToDB() {
      graph.forEachNode((current, attr) => {
        if (current) {
          axios
            .post('http://localhost:3000/map/node/create', {
              userID: userID,
              mapID: mapID,
              nodeinfo: {
                nodeName: attr.label,
                nodeID: current,
                color: attr.color,
                age: attr.years,
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
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
        }
      });
      graph.forEachEdge((current, attr, source, target, sourceAttr, targetAttr) => {
        if (current) {
          axios
            .post('http://localhost:3000/map/relationship/create', {
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
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
        }
      });
    },
    LoadFromDB() {
      axios
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
                size: 30,
                years: node.age,
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
                  size: 5,
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
          } else if (error.request) {
            console.log('Error: The server failed to respond to the get request\n' + error.message);
          } else {
            console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
          }
        });
    },
  });

  /**
   * Triggers the user to download the map JSON as "map.blurp".
   */
  function downloadMapJson() {
    // Get the JSON data string
    let jsonDataString =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph.toJSON()));

    // Create the download link
    let downloadElement = document.createElement('a');
    downloadElement.download = 'map.blurp';
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

      axios
        .patch(BACKEND_URL + '/map/node/update', {
          nodeID: id,
          mapID: mapID,
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
          } else if (error.request) {
            console.log(
              'Error: The server failed to respond to the update request\n' + error.message
            );
            msgRef.current.showMessage('Changes not saved, server not responding');
          }
        });
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

  /**
   * Triggers the user to download the map JSON as "map.blurp".
   */
  function downloadMapJson() {
    // Get the JSON data string
    let jsonDataString =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph.toJSON()));

    // Create the download link
    let downloadElement = document.createElement('a');
    downloadElement.download = 'map.blurp';
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

  function changeEdgeData(category, familiarity, stressCode, node1ID, node2ID, id) {
    try {
      graph.setEdgeAttribute(id, 'label', category);
      graph.setEdgeAttribute(id, 'familiarity', familiarity);
      graph.setEdgeAttribute(id, 'stressCode', stressCode);
      graph.setEdgeAttribute(id, 'node1ID', node1ID);
      graph.setEdgeAttribute(id, 'node2ID', node2ID);
      graph.setEdgeAttribute(id, 'color', edgeColor(stressCode));

      axios
        .patch(BACKEND_URL + '/map/relationship/update', {
          relationshipID: id,
          mapID: mapID,
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
          } else if (error.request) {
            console.log(
              'Error: The server failed to respond to the update request\n' + error.message
            );
            msgRef.current.showMessage('Changes not saved, server not responding');
          } else {
          }
        });
    } catch (error) {
      console.log(
        'Error: Some error has occured\n' + 'Edge id: ' + id + 'error message:\n' + error.message
      );
    }
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
        let prev_state = sigma.getCamera().getState();
        if (graph.order < 4) {
          prev_state.ratio = CAMERA_MAX;
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
        sigma.getCamera().setState(prev_state);
        setNodes(nodes.concat({ id: id, label: name }));
        axios
          .post(BACKEND_URL + '/map/node/create', {
            userID: userID,
            mapID: mapID,
            nodeinfo: {
              nodeName: name,
              nodeID: id,
              color: color,
              age: 0,
              type: nodeType.toLowerCase(),
              description: '',
              pos: {
                x: pos.x,
                y: pos.y,
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
              console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
            }
          });
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

          axios
            .post(BACKEND_URL + '/map/relationship/create', {
              mapID: mapID,
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
                console.log('Error: Some error has occured\n' + 'error message:\n' + error.message);
              }
            });
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
            // loop through the edges and delete each one connecting
            // to the deleted node
            // could rewrite this to filter based on source and target by
            // using the filterEdges iterator
            graph.forEachEdge((current, attr, source, target, sourceAttr, targetAttr) => {
              if (source == id || target == id) {
                axios
                  .delete(BACKEND_URL + '/map/relationship/delete', {
                    data: {
                      mapID: mapID,
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
                    } else if (error.request) {
                      console.log(
                        'Error: The server failed to respond to the delete request\n' +
                          error.message
                      );
                    } else {
                      console.log(
                        'Error: Some error has occured\n' + 'error message:\n' + error.message
                      );
                    }
                  });
              }
            });
            axios
              .delete(BACKEND_URL + '/map/node/delete', {
                data: {
                  mapID: mapID,
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
                } else if (error.request) {
                  console.log(
                    'Error: The server failed to respond to the delete request\n' + error.message
                  );
                } else {
                  console.log(
                    'Error: Some error has occured\n' + 'error message:\n' + error.message
                  );
                }
              });

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
          }
        },
        clickEdge: (event) => {
          if (mapToolbar === MAP_TOOLS.eraser) {
            const id = event.edge;
            graph.dropEdge(id);

            axios
              .delete(BACKEND_URL + '/map/relationship/delete', {
                data: {
                  mapID: mapID,
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
                } else if (error.request) {
                  console.log(
                    'Error: The server failed to respond to the delete request\n' + error.message
                  );
                } else {
                  console.log(
                    'Error: Some error has occured\n' + 'error message:\n' + error.message
                  );
                }
              });
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
          }
        },
        enterNode: (event) => {
          //once we enter a node, we do not want to trigger the click event. Only the clickNode.
          setClickTrigger(false);
        },
        leaveNode: (event) => {
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
                          onChange={(e) => setSize(e.target.value * 3)}
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
        <ControlsContainer className="absolute top-5 w-[500px]" position="top-center">
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
        <System_Toolbar ref={DBref} download={downloadMapJson} upload={uploadMapJson} />
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
        <MapModal />
      </div>
    </div>
  );
};

export default TestPage;
