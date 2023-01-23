import { useEffect, useState } from "react";
import { MultiUndirectedGraph, MultiGraph } from "graphology";
 
import { SigmaContainer, useLoadGraph, useRegisterEvents, ControlsContainer, SearchControl } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { v4 as uuidv4 } from 'uuid';
import { COLORS, NODE_TYPE } from "../constants/constants.ts";

import SearchBar from "../components/searchbar.jsx";
import DataSidebar from "../components/data_sidebar.jsx";
// import MyModal from "../components/modal.jsx" 


// export const LoadGraph = () => {
//   const loadGraph = useLoadGraph();

//   useEffect(() => {
//     //i'm leaving these settings "exposed" for future tweeks if necesssary
//     //we can also use pre-defined graph types: MultiGraph, MultiUndirectedGraph, etc.
//     // const graph = new Graph({type: "mixed", allowSelfLoops: false, multi: true});
//     const graph = new MultiUndirectedGraph();

//     //Node & Edges
//     //Use uuidv4() to random generate key IDs for edges to optimize performance
//     //and reduce namespace collision
//     graph.addNode("A", { x: 0, y: 0, label: "A", size: 15, color: "#FA4F40" });
//     graph.addNode("B", { x: 1, y: 1, label: "B", size: 15, color: "#FA4F40" });
//     graph.addNode("C", { x: -0.2, y: 2, label: "C", size: 15, color: "#FA4F40" });
//     graph.addEdgeWithKey(uuidv4(), "A", "B", {label: "friends"});
//     graph.addEdgeWithKey(uuidv4(), "B", "C", {label: "family"});


//     //console.log reports of all Edges attributes on the map
//     for (const {edge, attributes} of graph.edgeEntries()) {
//       console.log(edge, attributes);
//     }

//     //LoadGraph Hook
//     loadGraph(graph);
//   }, [loadGraph]);

//   return null;
// };
// const [graph, setGraph] = useState(new MultiUndirectedGraph());

const TestPage = () => {
  const [graph, setGraph] = useState(new MultiGraph());
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeType, setNodeType] = useState("PERSON");
  const [color, setColor] = useState("#FF0000");
  const [name, setName] = useState("");
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);


  function handleSubmit() {
    const id = uuidv4()
    const newNode = { id: id, label: name, size: size, color: color, x: event.x, y:event.y };
    const newGraph = new MultiGraph();
    setNodes(nodes => [...nodes, newNode]);

    nodes.forEach(node => {
      newGraph.addNode(node.id, { x: node.x, y: node.y, label: node.label, color: node.color, size: node.size});
    })
    edges.forEach(edge => {
      newGraph.addEdge(edge.nodeOne, edge.nodeTwo, {label: edge.label});
    })
    //this will add the most recent node, because the component (nodes.forEach & edges.forEach) is yet not render for the newly created node in nodes and edges
    //if this is the first node, you can use console.log to check the nodes.length and it will say zero since the most recent node is not rendered
    //if this is the second node, you will see that the lenght is 1 and so on and so forth
    // Might not be the best convention. Maybe cut a ticket
    newGraph.addNode(id, { x: event.x, y: event.y, label: name, color: color, size: size})
    console.log("The length of nodes is " + nodes.length)


    setGraph(newGraph)
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
                    <input placeholder="Node Name" type="text" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <br/>
                  <div>
                    <input placeholder="Color" type="text" value={color} onChange={e => setColor(e.target.value)} />
                  </div>
                  <br/>
                  <div>
                    <input placeholder="Size" type="text" value={size} onChange={e => setSize(e.target.value)} />
                  </div>
                  <br/>
                  <div>
                    <input placeholder="Type"type="text" value={nodeType} onChange={e => setNodeType(e.target.value)} />
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
        <DataSidebar/>
      </div>
    </div>
  );
};

export default TestPage
