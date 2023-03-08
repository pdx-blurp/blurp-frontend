import { useReducer } from 'react';
import { React, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { NodeData, EdgeData} from '../constants/classes.jsx';
import { NODE_TYPE, SIDEBAR_VIEW, RELATIONSHIPS, STRESS_CODE, FAMILIARITY } from '../constants/constants.ts';
import Slider from '@mui/material/Slider';

const notes_size = 255;

const SidebarForm = forwardRef((props, ref) => {
  /* 
    used this stackoverflow answer to help with getting the form to update 
    when the data its being fed is changed
    https://stackoverflow.com/a/68642185 

    and used this one for figuring out how to allow for a child function
    to be called from a parent component:
    https://stackoverflow.com/a/68642839
  */

  useEffect(() => {
    setData();
  }, [props.parent_node, props.parent_edge]);
  const [view, setView] = useState(SIDEBAR_VIEW.person);
  const [node, setNode] = useState({
    name: '',
    years: '',
    notes: '',
    type: NODE_TYPE.PERSON,
    id: '',
  });

  const [edge, setEdge] = useState({
    relation: RELATIONSHIPS.situational,
    familiarity: '',
    stressCode: 1,
    node1ID: '',
    node2ID: '',
    id: '',
    edgeSize: 4,
  });
  /* 
    Using this to work on pulling info from the forms:
    https://reactjs.org/docs/forms.html

    And using the link below for how to handle radio buttons:
    https://www.pluralsight.com/guides/how-to-use-radio-buttons-in-reactjs
  */
  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const e_name = target.name.split('.');
    if (target.type == 'radio') {
      setEdge({
        ...edge,
        relation: value,
      });
    } else {
      switch (e_name[0]) {
        case 'node':
          setNode({
            ...node,
            [e_name[1]]: value,
          });
          break;
        case 'edge':
          setEdge({
            ...edge,
            [e_name[1]]: value,
          });
      }
    }
  };

  const handleSubmit = (e) => {
    if (view == SIDEBAR_VIEW.edge) {
      props.changeEdgeData(
        edge.relation,
        edge.familiarity.toString(),
        edge.stressCode,
        edge.node1ID,
        edge.node2ID,
        edge.id,
        getSize(edge.familiarity) * 2,
      );
    } else {
      props.changeNodeData(node.name, node.years, node.notes, node.id);
    }
    e.preventDefault();
  };

  const clearState = () => {
    setNode({
      name: '',
      years: '',
      notes: '',
      type: NODE_TYPE.PERSON,
      id: '',
    });

    setEdge({
      relation: RELATIONSHIPS.situational,
      familiarity: '',
      stressCode: STRESS_CODE.MINIMAL,
      node1ID: '',
      node2ID: '',
      id: '',
      edgeSize: 4,
    });
  };

  const getSize = (familiarityLabel) => {
    for (const[key, element] of Object.entries(FAMILIARITY)) {
      if (element.label === familiarityLabel) {
        return element.value;
      }
    }
    return 2;
  }
  const setData = () => {
    const selected_node = props.parent_node.selected;
    const selected_edge = props.parent_edge.selected;
    clearState();
    if (selected_node.id != '') {
      setNode({
        name: selected_node.name,
        years: selected_node.years,
        notes: selected_node.notes,
        type: selected_node.type,
        id: selected_node.id,
      });
      if (selected_node.type != '') {
        if (selected_node.type == 'PERSON') setView(SIDEBAR_VIEW.person);
        else if (selected_node.type == 'PLACE') setView(SIDEBAR_VIEW.place);
        else if (selected_node.type == 'IDEA') setView(SIDEBAR_VIEW.idea);
      }
    } else if (selected_edge.id != '') {
      setEdge({
        relation: selected_edge.category,
        familiarity: selected_edge.familiarity,
        stressCode: selected_edge.stressCode,
        node1ID: selected_edge.node1,
        node2ID: selected_edge.node2,
        id: selected_edge.id,
        edgeSize: getSize(selected_edge.familiarity) * 2,
      });
      setView(SIDEBAR_VIEW.edge);
    }
  };

  const selectView = (sel_view) => {
    switch (sel_view) {
      case SIDEBAR_VIEW.none:
        return (
          <p className="m-4">
            This is a data sidebar. The data of the selected entity in the graph will appear here.
          </p>
        );
      case SIDEBAR_VIEW.person:
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Person</h1>
            <input
              type="text"
              name="node.name"
              placeholder="Name"
              className="textbox-sidebar"
              value={node.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="node.years"
              placeholder="Age"
              value={node.years}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="node.notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={node.notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case SIDEBAR_VIEW.place:
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Place</h1>
            <input
              type="text"
              name="node.name"
              placeholder="Name"
              value={node.name}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="node.notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={node.notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case SIDEBAR_VIEW.idea:
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Idea</h1>
            <input
              type="name"
              name="node.name"
              placeholder="Name"
              value={node.name}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="node.years"
              placeholder="Age/History"
              value={node.years}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="node.notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={node.notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case SIDEBAR_VIEW.edge:
        return (
          <form onSubmit={handleSubmit} className="grid justify-center">
            <h1 className="m-2 text-center text-xl">Edges/Relationships</h1>
            <fieldset className="m-2 w-11/12" onChange={handleChange} value={edge.relation}>
              <legend>Relationship Type:</legend>
              <input
                type="radio"
                value={RELATIONSHIPS.familial}
                checked={edge.relation === RELATIONSHIPS.familial}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="family">Familial Relationship</label>
              <br />
              <input
                type="radio"
                value={RELATIONSHIPS.friendship}
                checked={edge.relation === RELATIONSHIPS.friendship}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="friend">Friendships</label>
              <br />
              <input
                type="radio"
                value={RELATIONSHIPS.acquaintance}
                checked={edge.relation === RELATIONSHIPS.acquaintance}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="acquaint">Acquaintances</label>
              <br />
              <input
                type="radio"
                value={RELATIONSHIPS.romantic}
                checked={edge.relation === RELATIONSHIPS.romantic}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="romantic">Romantic Relationships</label>
              <br />
              <input
                type="radio"
                value={RELATIONSHIPS.work}
                checked={edge.relation === RELATIONSHIPS.work}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="work">Work Relationships</label>
              <br />
              <input
                type="radio"
                value={RELATIONSHIPS.situational}
                checked={edge.relation === RELATIONSHIPS.situational}
                onChange={handleChange}
                name="edge.relation"
              />
              <label htmlFor="undefined">Situational/Undefined Relationships</label>
              <br />
            </fieldset>
            <div className="m-2 grid w-11/12">
              <label>Familiarity</label>
              <select
                aria-label="Small"
                name="edge.familiarity"
                value={edge.familiarity}
                onChange={handleChange}
                className="mx-3">
                {Object.entries(FAMILIARITY).map(([key, value]) => (
                  <option key={key} value={value.label}>
                    {value.label}
                  </option>
                ))}
              </select>
              <label>Stress Level</label>
              <select
                name="edge.stressCode"
                className="rounded bg-slate-50 text-center"
                value={edge.stressCode}
                onChange={handleChange}>
                <option value="1">1 - feeling good</option>
                <option value="2">2 - feeling fine</option>
                <option value="3">3 - feeling anxious</option>
                <option value="4">4 - high stress/discomfort</option>
                <option value="5">5 - very high stress</option>
              </select>
            </div>
            <div className="m-2 w-11/12 text-lg">
              <u>{edge.node1ID}</u> is related to <u>{edge.node2ID}</u>
            </div>
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      default:
        return <></>;
    }
  };

  return <>{selectView(view)}</>;
});

export default SidebarForm;
