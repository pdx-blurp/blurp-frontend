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
  const child = useRef();
  const [clickTrigger, setClickTrigger] = useState(true);

  const DBref = useRef({
    SaveToDB() {
      console.log(JSON.stringify(graph));
      axios
        .get('http://localhost:3000/')
        .then((response) => {
          console.log(response);
        })
        .catch((error) =>
          console.log(
            'ERROR: ' +
              error.message +
              '\n' +
              'Failed to communicate with database\n' +
              'error name: ' +
              error.name +
              'request name: ' +
              error.request
          )
        );
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
    } catch {
      console.log('ERROR: failed to retrieve node with that ID');
      console.log('ID used: ' + id);
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
    } catch {
      console.log('ERROR: failed to retrieve edge with that ID');
      console.log('ID used: ' + id);
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
      const id = uuidv4();
      let prev_state = sigma.getCamera().getState();
      if (graph.size < 4) {
        prev_state.ratio = 3.0;
      }
      console.log(color);
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
    } else {
      graph.addEdgeWithKey(uuidv4(), node1, node2, {
        label: relationship,
        familiarity: edgeData.familiarity,
        stressCode: edgeData.stressCode,
        node1: '',
        node2: '',
        size: size,
        color: edgeColor(edgeData.stressCode),
      });
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
        click: (event) => {
          // Soln for preventing zooming in on a double click found here:
          // https://github.com/jacomyal/sigma.js/issues/1274
          event.preventSigmaDefault();
          if (clickTrigger === true) {
            event.preventSigmaDefault();
            const grabbed_pos = sigma.viewportToGraph(event);
            setPos({ x: grabbed_pos.x, y: grabbed_pos.y });
            if (mapToolbar === MAP_TOOLS.node || mapToolbar === MAP_TOOLS.edge) {
              setIsModalOpen(true);
            }
          }
        }, // node events
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
                          onChange={(e) => setSize(e.target.value)}
                          min={2}
                          max={10}
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
        graph={graph}
        ref={setSigma}
        settings={{
          renderEdgeLabels: true,
          minCameraRatio: 0.5,
          maxCameraRatio: 3.0,
          autoScale: false,
        }}>
        <ControlsContainer className="absolute top-5 w-[400px]" position="top-center">
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
        <System_Toolbar ref={DBref} />
      </div>
      <div className="absolute inset-y-0 top-0 right-0">
        <MapToolbar handleToolbarEvent={handleToolbarEvent} setSigmaCursor={setSigmaCursor} />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <ConfirmDeleteForm />
      </div>
    </div>
  );
};

export default TestPage;
