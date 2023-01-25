import { useEffect, useState } from 'react';
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
import { COLORS, NODE_TYPE } from '../constants/constants.ts';
import DataSidebar from '../components/data_sidebar.jsx';
import System_Toolbar from '../components/system_toolbar.jsx';

export const sidebarView = {
  closed: 'closed',
  none: 'none',
  person: 'person',
  place: 'place',
  idea: 'idea',
  edge: 'edge',
};

/* 
  graphData and Relationships were both made according 
  to the data objects/map architecture docs
*/
export const Relationships = {
  familial: 'familial',
  friendship: 'friendship',
  acquaintance: 'acquaintance',
  romantic: 'romantic',
  work: 'work',
  situational: 'situational',
};

export const NodeType = {
  person: 'person',
  place: 'place',
  idea: 'idea',
};

export class NodeData {
  constructor() {
    this.name = '';
    this.years = 0;
    this.notes = '';
    this.type = NodeType.person;
  }

  setData(name, years, notes, type) {
    this.name = name;
    this.years = years;
    this.notes = notes;
    this.type = type;
  }

  setName(name) {
    this.name = name;
  }

  setYears(years) {
    this.years = years;
  }

  setNotes(notes) {
    this.notes = notes;
  }

  setType(type) {
    this.type = type;
  }

  getData() {
    return [this.name, this.years, this.notes, this.type];
  }
}

export class EdgeData {
  constructor() {
    this.category = Relationships.situational;
    this.familiarity = 0;
    this.stressCode = 0;
    this.node1ID = 0;
    this.node2ID = 0;
  }
  setData(category, familiarity, stressCode, node1ID, node2ID) {
    this.category = category;
    this.familiarity = familiarity;
    this.stressCode = stressCode;
    this.node1ID = node1ID;
    this.node2ID = node2ID;
  }

  getData() {
    return [this.category, this.familiarity, this.stressCode, this.node1ID, this.node2ID];
  }
}

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodeType, setNodeType] = useState('PERSON');
  const [color, setColor] = useState('#FF0000');
  const [name, setName] = useState('');
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit() {
    const id = uuidv4();
    graph.addNode(id, {
      x: event.x,
      y: event.y,
      color: color,
      size: size,
      label: name,
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
        click: (event) => {
          setIsModalOpen(true);
        },
      });
    }, [registerEvents]);

    return null;
  };

  let testdata = new NodeData();
  testdata.setData('bingus', 17, 'this is a test', NodeType.person);

  return (
    //Sigma Graph Settings, reference graphology
    //Sigma inherits 100% of parent <div> width and height
    <div className="static h-screen w-screen">
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
      <SigmaContainer id="blurp-map-container" graph={graph} settings={{ renderEdgeLabels: true }}>
        <ControlsContainer>
          <SearchControl />
        </ControlsContainer>
        <GraphEvents />
      </SigmaContainer>
      <div className="absolute inset-y-0 right-0">
        <DataSidebar />
      </div>
      <div className="absolute inset-y-0 left-0">
        <System_Toolbar NodeData={testdata} />
      </div>
    </div>
  );
};

export default TestPage;
