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

import { v4 as uuidv4 } from 'uuid';
import { COLORS, NODE_TYPE, sidebarView } from '../constants/constants.ts';
import { NodeData, EdgeData } from '../constants/classes.jsx';
import DataSidebar from '../components/data_sidebar.jsx';
import GraphToolbar from '../components/graph_toolbar.jsx';
import System_Toolbar from '../components/system_toolbar.jsx';
import ConfirmDeleteForm from '../components/confirm_delete_form';

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState('PERSON');
  const [color, setColor] = useState('#FF0000');
  const [name, setName] = useState('');
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [node, setNode] = useState({ selected: new NodeData('', '', '', '', '') });
  const child = useRef();

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

  function handleSubmit() {
    const id = uuidv4();
    graph.addNode(id, {
      x: event.x,
      y: event.y,
      color: color,
      size: size,
      label: name,
      years: '',
      notes: '',
      entity: nodeType,
    });
    setIsModalOpen(false);
  }

  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    useEffect(() => {
      // Register the events
      registerEvents({
        // default mouse events
        doubleClick: (event) => {
          setIsModalOpen(true);
        }, // node events
        clickNode: (event) => {
          let selected_type = '';
          let retrieved = graph.getNodeAttributes(event.node);
          if (retrieved.entity === NODE_TYPE.PERSON) {
            child.current.changeView(sidebarView.person);
          } else if (retrieved.entity === NODE_TYPE.PLACE) {
            child.current.changeView(sidebarView.place);
          } else if (retrieved.entity === NODE_TYPE.IDEA) {
            child.current.changeView(sidebarView.idea);
          }
          console.log(event.node);
          console.log(retrieved);
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
                  <h3 className="text-3xl font-semibold">Add Node</h3>
                </div>
                {/*body*/}
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
                      <select type="text" value={color} onChange={(e) => setColor(e.target.value)}>
                        {Object.entries(COLORS).map(([color, value]) => (
                          <option key={color} value={value}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                    <br />
                    <div>
                      <input
                        placeholder="Size"
                        type="text"
                        onChange={(e) => setSize(e.target.value)}
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
        className="flex w-full justify-center"
        graph={graph}
        settings={{ renderEdgeLabels: true }}>
        <ControlsContainer className="absolute top-5 w-[400px]" position="top-center">
          <SearchControl />
        </ControlsContainer>
        <GraphEvents />
      </SigmaContainer>
      <div className="absolute inset-y-0 right-0">
        <DataSidebar ref={child} node={node} changeNodeData={changeNodeData} />
      </div>
      <div className="absolute inset-y-0 left-0">
        <System_Toolbar />
      </div>
      <div className="absolute inset-y-0 top-0 right-0">
        <GraphToolbar />
      </div>
      <div className="absolute inset-y-1/2 inset-x-1/2">
        <ConfirmDeleteForm />
      </div>
    </div>
  );
};

export default TestPage;
