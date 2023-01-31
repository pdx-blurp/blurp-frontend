import { useState } from 'react';
import { graphTools } from '../constants/constants';
import node_image from '../assets/node_image.svg';
import edge_image from '../assets/edge_image.svg';
import eraser_icon from '../assets/eraser_icon.svg';
import select_icon from '../assets/select_icon.svg';


function GraphToolbar () {

  const unselectedIconClassName = 'graph-toolbar-icon';
  const selectedIconClassName = 'graph-toolbar-icon-selected';
  // Keep track of which tool is currently selected
  const [selected, setSelected] = useState(graphTools.select);
  const [nodeClass, setNodeClass] = useState(unselectedIconClassName);
  const [edgeClass, setEdgeClass] = useState(unselectedIconClassName);
  const [selectClass, setSelectClass] = useState(selectedIconClassName);
  const [eraserClass, setEraserClass] = useState(unselectedIconClassName);

  // Unselects the tool that was currently selected (visually).
  function clearIconSelection() {
    setNodeClass(unselectedIconClassName);
    setEdgeClass(unselectedIconClassName);
    setSelectClass(unselectedIconClassName);
    setEraserClass(unselectedIconClassName);
  }
  function handleNodeSelection(obj) {
    clearIconSelection();
    setSelected(graphTools.node);
    setNodeClass(selectedIconClassName);
  }
  function handleEdgeSelection() {
    clearIconSelection();
    setSelected(graphTools.edge);
    setEdgeClass(selectedIconClassName);
  }
  function handleSelectSelection() {
    clearIconSelection();
    setSelected(graphTools.select);
    setSelectClass(selectedIconClassName);
  }
  function handleEraserSelection() {
    clearIconSelection();
    setSelected(graphTools.eraser);
    setEraserClass(selectedIconClassName);
  }

  return (
    <>
      <div className='graph-toolbar'>
        <button className='graph-toolbar-btn' onClick={() => handleNodeSelection()}>
          <img className={nodeClass} src={node_image}></img>
        </button>
        <button className='graph-toolbar-btn' onClick={() => handleEdgeSelection()}>
          <img className={edgeClass} src={edge_image}></img>
        </button>

        <div className='absolute mb-0 right-0 bottom-0'>
          <button className='graph-toolbar-btn' onClick={() => handleSelectSelection()}>
            <img className={selectClass} src={select_icon}></img>
          </button>
          <button className='graph-toolbar-btn' onClick={() => handleEraserSelection()}>
            <img className={eraserClass} src={eraser_icon}></img>
          </button>
        </div>
      </div>
    </>
  );
}

export default GraphToolbar;