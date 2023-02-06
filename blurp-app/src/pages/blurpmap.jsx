import { useEffect, useState, useRef } from 'react';
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

import { v4 as uuidv4 } from 'uuid';
import { COLORS, NODE_TYPE, SIDEBAR_VIEW, RELATIONSHIPS } from '../constants/constants.ts';
import { NodeData, EdgeData } from '../constants/classes.jsx';
import DataSidebar from '../components/data_sidebar.jsx';
import MapToolbar from '../components/map_toolbar.jsx';
import System_Toolbar from '../components/system_toolbar.jsx';
import ConfirmDeleteForm from '../components/confirm_delete_form';

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState('PERSON');
  const [color, setColor] = useState('#FF0000');
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
  const [isNode, setIsNode] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [sigma, setSigma] = useState(null);
  const child = useRef();
  const [sigmaCursor, setSigmaCursor] = useState('cursor-default');

  function changeNodeData(name, years, notes, id) {
    try {
      graph.setNodeAttribute(id, 'label', name);
      graph.setNodeAttribute(id, 'years', years);
      graph.setNodeAttribute(id, 'notes', notes);
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
    } catch {
      console.log('ERROR: failed to retrieve edge with that ID');
      console.log('ID used: ' + id);
    }
  }

  function handleIsNode(data) {
    if (data === true) {
      setModalTitle('Add Node');
      setIsNode(true);
    } else {
      setModalTitle('Add Edge');
      setIsNode(false);
    }
  }
  function handleSubmit() {
    if (isNode && sigma) {
      const id = uuidv4();
      let prev_state = sigma.getCamera().getState();
      if (graph.size < 4) {
        prev_state.ratio = 2.0;
      }
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
        familiarity: '',
        stressCode: '',
        node1: '',
        node2: '',
        size: size,
        color: 'grey',
      });
    }

    //closes modal
    setIsModalOpen(false);
  }

  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    /* 
      Sigma used here for getting graph coordinates, which allows for us to place nodes
      where the user clicked. Used this example to get it working:
      https://sim51.github.io/react-sigma/docs/example/drag_n_drop 
    */

    useEffect(() => {
      // Register the events
      registerEvents({
        // default mouse events
        doubleClick: (event) => {
          // Soln for preventing zooming in on a double click found here:
          // https://github.com/jacomyal/sigma.js/issues/1274
          event.preventSigmaDefault();
          const grabbed_pos = sigma.viewportToGraph(event);
          setPos({ x: grabbed_pos.x, y: grabbed_pos.y });
          setIsModalOpen(true);
        }, // node events
        clickNode: (event) => {
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
        },
        clickEdge: (event) => {
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
        },
        //Current rightClickNode will delete the node. Change in future
        rightClickNode: (event) => {
          //event.node contains node id
          graph.dropNode(event.node);

          //update nodes
          setNodes(
            nodes.filter((node) => {
              return node.id !== event.node;
            })
          );
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
                        <select
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}>
                          {Object.entries(COLORS).map(([color, value]) => (
                            <option key={color} value={value}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <label>Size</label>
                        <Slider
                          onChange={(e) => setSize(e.target.value)}
                          min={1}
                          max={20}
                          aria-label="small"
                          valueLabelDisplay="auto"
                        />
                      </div>
                      <br />
                      <div>
                        <select
                          type="text"
                          value={nodeType}
                          onChange={(e) => setNodeType(e.target.value)}>
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
                        <label>Thickness</label>
                        <Slider
                          onChange={(e) => setSize(e.target.value)}
                          min={2}
                          max={10}
                          aria-label="small"
                          valueLabelDisplay="auto"
                        />
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
      {/* ratio will change in the future, currently it's bigger while we're
          working to get node placement to work based on the mouse pos*/}
      <SigmaContainer
        id="blurp-map-container"
        className={"flex w-full justify-center " + sigmaCursor}
        graph={graph}
        ref={setSigma}
        settings={{
          renderEdgeLabels: true,
          minCameraRatio: 0.6,
          maxCameraRatio: 2,
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
        <System_Toolbar />
      </div>
      <div className="absolute inset-y-0 top-0 right-0">
        <MapToolbar handleIsNode={handleIsNode} setSigmaCursor={setSigmaCursor}/>
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <ConfirmDeleteForm />
      </div>
    </div>
  );
};

export default TestPage;
