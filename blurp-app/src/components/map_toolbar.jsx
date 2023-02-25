import { useState } from 'react';
import { MAP_TOOLS, SIGMA_CURSOR } from '../constants/constants';
import node_image from '../assets/node_image.svg';
import edge_image from '../assets/edge_image.svg';
import eraser_icon from '../assets/eraser_icon.svg';
import select_icon from '../assets/select_icon.svg';
import Category from './category';
import Tooltip from '@mui/material/Tooltip';
import { FunnelIcon } from '@heroicons/react/20/solid';

function MapToolbar(props) {
  const UNSELECTED_ICON_CLASSNAME = 'graph-toolbar-icon';
  const SELECTED_ICON_CLASSNAME = 'graph-toolbar-icon-selected';
  // Keep track of which tool is currently selected
  const [selected, setSelected] = useState(MAP_TOOLS.select);
  const [nodeClass, setNodeClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [edgeClass, setEdgeClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [selectClass, setSelectClass] = useState(SELECTED_ICON_CLASSNAME);
  const [eraserClass, setEraserClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [categoryClass, setCategoryClass] = useState(UNSELECTED_ICON_CLASSNAME);
  // Unselects the tool that was currently selected (visually).
  function clearIconSelection() {
    setNodeClass(UNSELECTED_ICON_CLASSNAME);
    setEdgeClass(UNSELECTED_ICON_CLASSNAME);
    setSelectClass(UNSELECTED_ICON_CLASSNAME);
    setEraserClass(UNSELECTED_ICON_CLASSNAME);
    setCategoryClass(UNSELECTED_ICON_CLASSNAME);
  }
  function handleNodeSelection(obj) {
    props.handleToolbarEvent(MAP_TOOLS.node);
    props.setSigmaCursor(SIGMA_CURSOR.NODE);
    clearIconSelection();
    setSelected(MAP_TOOLS.node);
    setNodeClass(SELECTED_ICON_CLASSNAME);
  }
  function handleEdgeSelection() {
    props.handleToolbarEvent(MAP_TOOLS.edge);
    props.setSigmaCursor(SIGMA_CURSOR.EDGE);
    clearIconSelection();
    setSelected(MAP_TOOLS.edge);
    setEdgeClass(SELECTED_ICON_CLASSNAME);
  }
  function handleSelectSelection() {
    props.handleToolbarEvent(MAP_TOOLS.select);
    clearIconSelection();
    props.setSigmaCursor(SIGMA_CURSOR.DEFAULT);
    setSelected(MAP_TOOLS.select);
    setSelectClass(SELECTED_ICON_CLASSNAME);
  }
  function handleEraserSelection() {
    props.handleToolbarEvent(MAP_TOOLS.eraser);
    clearIconSelection();
    props.setSigmaCursor(SIGMA_CURSOR.ERASER);
    setSelected(MAP_TOOLS.eraser);
    setEraserClass(SELECTED_ICON_CLASSNAME);
  }
  function handleCategorySelection() {
    props.handleToolbarEvent(MAP_TOOLS.category);
    clearIconSelection();
    props.setSigmaCursor(SIGMA_CURSOR.CATEGORY);
    setSelected(MAP_TOOLS.category);
    setCategoryClass(SELECTED_ICON_CLASSNAME);
  }
  return (
    <>
      <div className="graph-toolbar">
        <Tooltip title="Node tool" enterDelay={700} placement="left" arrow>
          <button className="graph-toolbar-btn" onClick={() => handleNodeSelection()}>
            <img alt="Node tool" className={nodeClass} src={node_image}></img>
          </button>
        </Tooltip>
        <Tooltip title="Edge tool" enterDelay={700} placement="left" arrow>
          <button className="graph-toolbar-btn" onClick={() => handleEdgeSelection()}>
            <img alt="Edge tool" className={edgeClass} src={edge_image}></img>
          </button>
        </Tooltip>
        <div className="absolute right-0 bottom-0 mb-0">
          <Tooltip title="Select mode" enterDelay={700} placement="left" arrow>
            <button className="graph-toolbar-btn" onClick={() => handleSelectSelection()}>
              <img alt="Select mode" className={selectClass} src={select_icon}></img>
            </button>
          </Tooltip>
          <Tooltip title="Eraser" enterDelay={700} placement="left" arrow>
            <button className="graph-toolbar-btn" onClick={() => handleEraserSelection()}>
              <img alt="Eraser" className={eraserClass} src={eraser_icon}></img>
            </button>
          </Tooltip>
          <Tooltip title="Category" enterDelay={700} placement="left" arrow>
            <button className="graph-toolbar-btn" onClick={() => handleCategorySelection()}>
              <FunnelIcon className={categoryClass} aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default MapToolbar;
