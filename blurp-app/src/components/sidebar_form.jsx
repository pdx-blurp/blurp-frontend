import { React, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { sidebarView, Relationships, NodeType, NodeData, EdgeData } from '../pages/blurpmap.jsx';

const notes_size = 255;

const SidebarForm = forwardRef(function SidebarForm({ view, parent_node, parent_edge }, ref) {
  /* 
    used this stackoverflow answer to help with getting the form to update 
    when the data its being fed is changed
    https://stackoverflow.com/a/68642185 

    and used this one for figuring out how to allow for a child function
    to be called from a parent component:
    https://stackoverflow.com/a/68642839
  */
  useEffect(() => setData(), [parent_node]);
  const [node, setNode] = useState({
    name: '',
    years: '',
    notes: '',
    type: NodeType.person,
  });

  const [edge, setEdge] = useState({
    relation: Relationships.situational,
    familiarity: '',
    stressLevel: '',
    node1ID: '',
    node2ID: '',
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
    const e_name = target.name;

    console.log(target + ' ' + value + ' ' + e_name);

    if (target.type == 'radio') {
      switch (value) {
        case 'family':
          setEdge({
            ...edge,
            relation: Relationships.familial,
          });
          break;
        case 'friend':
          setEdge({
            ...edge,
            relation: Relationships.friendship,
          });
          break;
        case 'acquaint':
          setEdge({
            ...edge,
            relation: Relationships.acquaintance,
          });
          break;
        case 'romantic':
          setEdge({
            ...edge,
            relation: Relationships.romantic,
          });
          break;
        case 'work':
          setEdge({
            ...edge,
            relation: Relationships.work,
          });
          break;
        case 'undefined':
          setEdge({
            ...edge,
            relation: Relationships.situational,
          });
          break;
      }
    } else {
      console.log('e_name: ' + e_name + '\nvalue :' + value);
      setNode({
        ...node,
        [e_name]: value,
      });
      console.log('state: ' + node.name);
    }
  };

  const display = () => {
    console.log('name: ' + node.name);
    console.log('years: ' + node.years);
    console.log('notes: ' + node.notes);
    console.log('type: ' + node.type);
    console.log('relation: ' + edge.relation);
    console.log('familiarity: ' + edge.familiarity);
    console.log('stressLevel: ' + edge.stressLevel);
  };

  const handleSubmit = (e) => {
    // Will be replaced with code that will send the data back to the node
    parent_node.setData(node.name, node.years, node.notes, node.type);

    e.preventDefault();
  };

  const clearState = () => {
    setNode({
      name: '',
      years: '',
      notes: '',
      type: NodeType.person,
    });

    setEdge({
      relation: Relationships.situational,
      familiarity: '',
      stressLevel: '',
      node1ID: '',
      node2ID: '',
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      clearState: clearState,
    }),
    []
  );

  const setData = () => {
    console.log('ran!');
    if (parent_node) {
      let node_name, node_years, node_notes, node_type;
      [node_name, node_years, node_notes, node_type] = parent_node.getData();
      node.name = node_name;
      node.years = node_years;
      node.notes = node_notes;
      node.type = node_type;
    } else if (parent_edge) {
      let edge_cat, edge_fam, edge_stress, edge_1ID, edge_2ID;
      [edge_cat, edge_fam, edge_stress, edge_1ID, edge_2ID] = parent_edge.getData();
      edge.category = edge_cat;
      edge.familiarity = edge_fam;
      edge.stressLevel = edge_stress;
      edge.node1ID = edge_1ID;
      edge.node2ID = edge_2ID;
    }
  };

  const selectView = () => {
    display();
    console.log(parent_node);
    switch (view) {
      case sidebarView.none:
        return (
          <p className="m-4">
            This is a data sidebar. The data of the selected entity in the graph will appear here.
          </p>
        );
      case sidebarView.person:
        node.type = NodeType.person;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Person</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="textbox-sidebar"
              value={node.name}
              onChange={(e) => {
                setNode({
                  ...node,
                  name: e.target.value,
                });
                console.log(node.name);
              }}
            />
            <input
              type="number"
              name="years"
              placeholder="Age"
              value={node.years}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
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
      case sidebarView.place:
        node.type = NodeType.place;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Place</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={node.name}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
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
      case sidebarView.idea:
        node.type = NodeType.idea;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Idea</h1>
            <input
              type="name"
              name="name"
              placeholder="Name"
              value={node.name}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="years"
              placeholder="Age/History"
              value={node.years}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
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
      case sidebarView.edge:
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Edges/Relationships</h1>
            <div className="m-2 w-11/12" onChange={handleChange}>
              <legend>Relationship Type:</legend>
              <input type="radio" value="family" name="relation" />
              <label htmlFor="family">Familial Relationship</label>
              <br />
              <input type="radio" value="friend" name="relation" />
              <label htmlFor="friend">Friendships</label>
              <br />
              <input type="radio" value="acquaint" name="relation" />
              <label htmlFor="acquaint">Acquaintances</label>
              <br />
              <input type="radio" value="romantic" name="relation" />
              <label htmlFor="romantic">Romantic Relationships</label>
              <br />
              <input type="radio" value="work" name="relation" />
              <label htmlFor="work">Work Relationships</label>
              <br />
              <input type="radio" value="undefined" name="relation" />
              <label htmlFor="undefined">Situational/Undefined Relationships</label>
              <br />
            </div>
            <input
              type="number"
              name="familiarity"
              placeholder="Familiarity"
              value={node.familiarity}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="stressLevel"
              placeholder="Stress Level"
              value={node.stressLevel}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <div className="m-4 w-11/12 text-lg">
              <u>{node.node1ID}</u> is related to <u>{node.node2ID}</u>
            </div>
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      default:
        // aligns with closed state, shouldn't happen but wanted to guard it
        return <></>;
    }
  };

  return <>{selectView()}</>;
});

export default SidebarForm;
