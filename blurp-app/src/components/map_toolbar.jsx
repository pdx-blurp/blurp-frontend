import { useState } from 'react';
import { MAP_TOOLS } from '../constants/constants';
import node_image from '../assets/node_image.svg';
import edge_image from '../assets/edge_image.svg';
import eraser_icon from '../assets/eraser_icon.svg';
import select_icon from '../assets/select_icon.svg';

import Tooltip from '@mui/material/Tooltip';


function MapToolbar (props) {

  const UNSELECTED_ICON_CLASSNAME = 'graph-toolbar-icon';
  const SELECTED_ICON_CLASSNAME = 'graph-toolbar-icon-selected';
  // Keep track of which tool is currently selected
  const [selected, setSelected] = useState(MAP_TOOLS.select);
  const [nodeClass, setNodeClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [edgeClass, setEdgeClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [selectClass, setSelectClass] = useState(SELECTED_ICON_CLASSNAME);
  const [eraserClass, setEraserClass] = useState(UNSELECTED_ICON_CLASSNAME);

  // Unselects the tool that was currently selected (visually).
  function clearIconSelection() {
    setNodeClass(UNSELECTED_ICON_CLASSNAME);
    setEdgeClass(UNSELECTED_ICON_CLASSNAME);
    setSelectClass(UNSELECTED_ICON_CLASSNAME);
    setEraserClass(UNSELECTED_ICON_CLASSNAME);
  }
  function handleNodeSelection(obj) {
    props.handleIsNode(true);
    props.setSigmaCursor('cursor-node');
    clearIconSelection();
    setSelected(MAP_TOOLS.node);
    setNodeClass(SELECTED_ICON_CLASSNAME);
  }
  function handleEdgeSelection() {
    props.handleIsNode(false);
    props.setSigmaCursor('cursor-edge');
    clearIconSelection();
    setSelected(MAP_TOOLS.edge);
    setEdgeClass(SELECTED_ICON_CLASSNAME);
  }
  function handleSelectSelection() {
    clearIconSelection();
    props.setSigmaCursor('cursor-default');
    setSelected(MAP_TOOLS.select);
    setSelectClass(SELECTED_ICON_CLASSNAME);
  }
  function handleEraserSelection() {
    clearIconSelection();
    props.setSigmaCursor('cursor-eraser');
    setSelected(MAP_TOOLS.eraser);
    setEraserClass(SELECTED_ICON_CLASSNAME);
  }

  return (
    <>
      <div className='graph-toolbar'>
        <Tooltip title='Node tool' enterDelay={700} placement='left' arrow>
          <button className='graph-toolbar-btn' onClick={() => handleNodeSelection()}>
            <img className={nodeClass} src={node_image}></img>
          </button>
        </Tooltip>
        <Tooltip title='Edge tool' enterDelay={700} placement='left' arrow>
        <button className='graph-toolbar-btn' onClick={() => handleEdgeSelection()}>
          <img className={edgeClass} src={edge_image}></img>
        </button>
        </Tooltip>
        <div className='absolute mb-0 right-0 bottom-0'>
          <Tooltip title='Select mode' enterDelay={700} placement='left' arrow>
          <button className='graph-toolbar-btn' onClick={() => handleSelectSelection()}>
            <img className={selectClass} src={select_icon}></img>
          </button>
          </Tooltip>
          <Tooltip title='Eraser' enterDelay={700} placement='left' arrow>
          <button className='graph-toolbar-btn' onClick={() => handleEraserSelection()}>
            <img className={eraserClass} src={eraser_icon}></img>
          </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default MapToolbar;