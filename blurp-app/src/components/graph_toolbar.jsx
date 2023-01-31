import { useState } from 'react';
import { graphTools } from '../constants/constants';
import node_image from '../assets/node_image.svg';
import edge_image from '../assets/edge_image.svg';
import eraser_icon from '../assets/eraser_icon.svg';
import select_icon from '../assets/select_icon.svg';


function GraphToolbar () {

  // Keep track of which tool is currently selected
  const [selected, setSelected] = useState(graphTools.select);

  function handleNodeSelection() {

  }
  function handleEdgeSelection() {

  }
  function handleSelectSelection() {

  }
  function handleEraserSelection() {

  }

  return (
    <>
      <div className='graph-toolbar'>
        <button className='graph-toolbar-btn' onClick={handleNodeSelection}>
          <img className='graph-toolbar-icon' src={node_image}></img>
        </button>
        <button className='graph-toolbar-btn' onClick={handleEdgeSelection}>
          <img className='graph-toolbar-icon' src={edge_image}></img>
        </button>

        <div className='absolute mb-0 right-0 bottom-0'>
          <button className='graph-toolbar-btn' onClick={handleSelectSelection}>
            <img className='graph-toolbar-icon' src={select_icon}></img>
          </button>
          <button className='graph-toolbar-btn' onClick={handleEraserSelection}>
            <img className='graph-toolbar-icon' src={eraser_icon}></img>
          </button>
        </div>
      </div>
    </>
  );
}

export default GraphToolbar;