import { useState } from 'react';
import { MAP_TOOLS, NODE_TYPE, SIGMA_CURSOR } from '../constants/constants';
import node_image from '../assets/node_image.svg';
import person_image from '../assets/person.svg';
import place_image from '../assets/place.svg';
import idea_image from '../assets/idea.svg';
import edge_image from '../assets/edge_image.svg';
import move_icon from '../assets/grab_icon.svg';
import eraser_icon from '../assets/eraser_icon.svg';
import select_icon from '../assets/select_icon.svg';
import Category from './category';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';

function MapToolbar(props) {
  const UNSELECTED_ICON_CLASSNAME = 'graph-toolbar-icon';
  const SELECTED_ICON_CLASSNAME = 'graph-toolbar-icon-selected';
  // Keep track of which tool is currently selected
  const [selected, setSelected] = useState(MAP_TOOLS.select);
  const [personClass, setPersonClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [placeClass, setPlaceClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [ideaClass, setIdeaClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [edgeClass, setEdgeClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [moveClass, setMoveClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [selectClass, setSelectClass] = useState(SELECTED_ICON_CLASSNAME);
  const [eraserClass, setEraserClass] = useState(UNSELECTED_ICON_CLASSNAME);
  const [anchorEl, setAnchorEl] = useState();

  // Unselects the tool that was currently selected (visually).
  function clearIconSelection() {
    setPersonClass(UNSELECTED_ICON_CLASSNAME);
    setPlaceClass(UNSELECTED_ICON_CLASSNAME);
    setIdeaClass(UNSELECTED_ICON_CLASSNAME);
    setEdgeClass(UNSELECTED_ICON_CLASSNAME);
    setMoveClass(UNSELECTED_ICON_CLASSNAME);
    setSelectClass(UNSELECTED_ICON_CLASSNAME);
    setEraserClass(UNSELECTED_ICON_CLASSNAME);
    //setCategoryClass(UNSELECTED_ICON_CLASSNAME);
  }
  function handleNodeSelection(event, type) {
    props.setSize(1);
    props.setSigmaCursor(SIGMA_CURSOR.NODE);
    clearIconSelection();
    props.setNodeType(type);

    switch (type) {
      case NODE_TYPE.PERSON:
        setPersonClass(SELECTED_ICON_CLASSNAME);
        props.handleToolbarEvent(MAP_TOOLS.person);
        setSelected(MAP_TOOLS.person);
        break;
      case NODE_TYPE.PLACE:
        setPlaceClass(SELECTED_ICON_CLASSNAME);
        props.handleToolbarEvent(MAP_TOOLS.place);
        setSelected(MAP_TOOLS.place);
        break;
      case NODE_TYPE.IDEA:
        setIdeaClass(SELECTED_ICON_CLASSNAME);
        props.handleToolbarEvent(MAP_TOOLS.idea);
        setSelected(MAP_TOOLS.idea);
        break;
    }

    setAnchorEl(event.currentTarget);
  }

  function handleEdgeSelection() {
    props.handleToolbarEvent(MAP_TOOLS.edge);
    props.setSigmaCursor(SIGMA_CURSOR.EDGE);
    clearIconSelection();
    setSelected(MAP_TOOLS.edge);
    setEdgeClass(SELECTED_ICON_CLASSNAME);
  }

  function handleMoveSelection() {
    props.handleToolbarEvent(MAP_TOOLS.move);
    clearIconSelection();
    props.setSigmaCursor(SIGMA_CURSOR.MOVE);
    setSelected(MAP_TOOLS.default);
    setMoveClass(SELECTED_ICON_CLASSNAME);
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

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className="graph-toolbar">
        <Tooltip title="Person Node tool" enterDelay={700} placement="left" arrow>
          <button
            className="graph-toolbar-btn"
            onClick={(e) => handleNodeSelection(e, NODE_TYPE.PERSON)}>
            <img alt="Person Node tool" className={personClass} src={person_image}></img>
          </button>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: -4,
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            width: '100%',
            height: '15rem',
            '& .MuiPopover-paper': {
              overflow: 'visible',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
            },
          }}
          onClose={() => setAnchorEl(null)}>
          <div className="flex justify-center overflow-visible rounded-l-lg border border-gray-400 bg-gray-300">
            <label className="m-2 self-center font-bold">Size</label>
            <Slider
              value={props.size}
              onChange={(e) => props.setSize(e.target.value)}
              min={1}
              max={10}
              marks
              aria-label="small"
              size="small"
              valueLabelDisplay="auto"
              className="my-1 mx-4 self-end"
              sx={{
                width: '15rem',
              }}
            />
          </div>
        </Popover>
        <Tooltip title="Place Node tool" enterDelay={700} placement="left" arrow>
          <button
            className="graph-toolbar-btn"
            onClick={(e) => handleNodeSelection(e, NODE_TYPE.PLACE)}>
            <img alt="Place Node tool" className={placeClass} src={place_image}></img>
          </button>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: -4,
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            width: '100%',
            height: '15rem',
            '& .MuiPopover-paper': {
              overflow: 'visible',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
            },
          }}
          onClose={() => setAnchorEl(null)}>
          <div className="flex justify-center overflow-visible rounded-l-lg border border-gray-400 bg-gray-300">
            <label className="m-2 self-center font-bold">Size</label>
            <Slider
              value={props.size}
              onChange={(e) => props.setSize(e.target.value)}
              min={1}
              max={10}
              marks
              aria-label="small"
              size="small"
              valueLabelDisplay="auto"
              className="my-1 mx-4 self-end"
              sx={{
                width: '15rem',
              }}
            />
          </div>
        </Popover>
        <Tooltip title="Idea Node tool" enterDelay={700} placement="left" arrow>
          <button
            className="graph-toolbar-btn"
            onClick={(e) => handleNodeSelection(e, NODE_TYPE.IDEA)}>
            <img alt="Idea Node tool" className={ideaClass} src={idea_image}></img>
          </button>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: -4,
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            width: '100%',
            height: '15rem',
            '& .MuiPopover-paper': {
              overflow: 'visible',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
            },
          }}
          onClose={() => setAnchorEl(null)}>
          <div className="flex justify-center overflow-visible rounded-l-lg border border-gray-400 bg-gray-300">
            <label className="m-2 self-center font-bold">Size</label>
            <Slider
              value={props.size}
              onChange={(e) => props.setSize(e.target.value)}
              min={1}
              max={10}
              marks
              aria-label="small"
              size="small"
              valueLabelDisplay="auto"
              className="my-1 mx-4 self-end"
              sx={{
                width: '15rem',
              }}
            />
          </div>
        </Popover>

        <Tooltip title="Edge tool" enterDelay={700} placement="left" arrow>
          <button className="graph-toolbar-btn" onClick={() => handleEdgeSelection()}>
            <img alt="Edge tool" className={edgeClass} src={edge_image}></img>
          </button>
        </Tooltip>
        <div className="absolute right-0 bottom-0 mb-0">
          <Tooltip title="Move mode" enterDelay={700} placement="left" arrow>
            <button className="graph-toolbar-btn" onClick={() => handleMoveSelection()}>
              <img alt="Move mode" className={moveClass} src={move_icon}></img>
            </button>
          </Tooltip>
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
        </div>
      </div>
    </>
  );
}

export default MapToolbar;
