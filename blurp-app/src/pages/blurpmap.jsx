import { useEffect } from 'react';
import MultiUndirectedGraph from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import { v4 as uuidv4 } from 'uuid';

import SearchBar from '../components/searchbar.jsx';
import DataSidebar from '../components/data_sidebar.jsx';

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
}

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
    graph.addNode('A', { x: 0, y: 0, label: 'A', size: 15, color: '#FA4F40' });
    graph.addNode('B', { x: 1, y: 1, label: 'B', size: 15, color: '#FA4F40' });
    graph.addNode('C', { x: -0.2, y: 2, label: 'C', size: 15, color: '#FA4F40' });
    graph.addEdgeWithKey(uuidv4(), 'A', 'B', { label: 'friends' });
    graph.addEdgeWithKey(uuidv4(), 'B', 'C', { label: 'family' });

    //console.log reports of all Edges attributes on the map
    for (const { edge, attributes } of graph.edgeEntries()) {
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
    <div className="static h-screen w-screen">
      <SigmaContainer
        id="blurp-map-container"
        graph={MultiUndirectedGraph}
        settings={{ renderEdgeLabels: true }}>
        <LoadGraph />
      </SigmaContainer>
      <div className="absolute inset-x-0 top-0">
        <SearchBar />
      </div>
      <div className="absolute inset-y-0 right-0">
        <DataSidebar />
      </div>
    </div>
  );
};

export default TestPage;
