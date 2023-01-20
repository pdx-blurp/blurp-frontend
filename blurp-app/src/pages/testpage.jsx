import { useEffect } from "react";
import MultiUndirectedGraph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { v4 as uuidv4 } from 'uuid';

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    //i'm leaving these settings "exposed" for future tweeks if necesssary
    //we can also use pre-defined graph types: MultiGraph, MultiUndirectedGraph, etc.
    // const graph = new Graph({type: "mixed", allowSelfLoops: false, multi: true});
    const graph = new MultiUndirectedGraph();

    //Node & Edges
    //Use uuidv4() to random generate key IDs for edges to optimize performance
    //and reduce namespace collision
    graph.addNode("A", { x: 0, y: 0, label: "A", size: 15, color: "#FA4F40" });
    graph.addNode("B", { x: 1, y: 1, label: "B", size: 15, color: "#FA4F40" });
    graph.addEdgeWithKey(uuidv4(), "A", "B", {label: "friends", size: 5, color: "black"});


    //console.log reports of all Edges attributes on the map
    for (const {edge, attributes} of graph.edgeEntries()) {
      console.log(edge, attributes);
    }

    //LoadGraph Hook
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const TestPage = () => {
  return (
    //Sigma Graph Settings, reference graphology
    //Sigma inherits 100% of parent <div> width and height
    <div className="w-screen h-screen">
      <SigmaContainer 
        id="blurp-map-container"
        graph={MultiUndirectedGraph}
      >
        <LoadGraph />
      </SigmaContainer>
    </div>
  );
};

export default TestPage