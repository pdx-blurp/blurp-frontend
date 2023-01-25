import { useEffect, useState } from "react";
import { MultiGraph } from "graphology";
import { SigmaContainer, useRegisterEvents, ControlsContainer, SearchControl, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

import { v4 as uuidv4 } from 'uuid';
import { COLORS, NODE_TYPE } from "../constants/constants.ts";
import DataSidebar from "../components/data_sidebar.jsx";
import GraphToolbar from "../components/graph_toolbar.jsx";
import System_Toolbar from "../components/system_toolbar.jsx";

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
  const [nodeType, setNodeType] = useState("PERSON");
  const [color, setColor] = useState("#FF0000");
  const [name, setName] = useState("");
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);



  function handleSubmit() {
    const id = uuidv4();
    graph.addNode(id, {x: event.x, y: event.y, color: color, size: size, label: name, entity: nodeType});
    setIsModalOpen(false); 
  }
  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    useEffect(() => {
      // Register the events
      registerEvents({
        // default mouse events
        click: (event) => {
          setIsModalOpen(true)
        },
      });
    }, [registerEvents]);

    return null;
  };
  return (
    //Sigma Graph Settings, reference graphology
    //Sigma inherits 100% of parent <div> width and height
    <div className="static w-screen h-screen">
      <div>
        {isModalOpen && (
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add Node
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <div>
                  <div>
                    <input placeholder="Name" type="text" onChange={e => setName(e.target.value)} />
                  </div>
                  <br/>
                  <div>
                    <select type="text" value={color} onChange={e => setColor(e.target.value)} >
                      {Object.entries(COLORS).map(([color, value]) => <option key={color} value={value}>{color}</option>)} 
                    </select> 
                    
                  </div>
                  <br/>
                  <div>
                    <input placeholder="Size" type="text"  onChange={e => setSize(e.target.value)} />
                  </div>
                  <br/>
                  <div>
                    <select type="text" value={nodeType} onChange={e => setNodeType(e.target.value)} >
                      {Object.entries(NODE_TYPE).map(([key, value]) => <option key={key} value={value}>{key}</option>)}
                    </select>
                  </div>
              </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSubmit}
                  >
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
        graph={graph}
        settings={{ renderEdgeLabels: true}}
      >
        <ControlsContainer>
          <SearchControl />
        </ControlsContainer>
        <GraphEvents />
      </SigmaContainer>
      <div className="absolute inset-y-0 right-0">
        <DataSidebar />
      </div>
      <div className="absolute inset-y-0 left-0">
        <System_Toolbar/>
      </div>
      <div className="absolute top-0 inset-y-0 right-0">
        <GraphToolbar/>
      </div>
    </div>
  );
};

export default TestPage