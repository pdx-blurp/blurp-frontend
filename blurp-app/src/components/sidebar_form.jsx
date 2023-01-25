import React from 'react';
import { sidebarView, Relationships, NodeType, NodeData, EdgeData } from '../pages/blurpmap.jsx';

const notes_size = 255;

const SidebarForm = ({ view }) => {
  let name = '';
  let years = '';
  let notes = '';
  let type = NodeType.person;
  let relation = Relationships.situational;
  let familiarity = '';
  let stressLevel = '';
  let node1ID = '';
  let node2ID = '';

  /* let view =  props.view;
    handleChange =  handleChange.bind(this);
    handleSubmit =  handleSubmit.bind(this); */
  /* 
    Using this to work on pulling info from the forms:
    https://reactjs.org/docs/forms.html

    And using the link below for how to handle radio buttons:
    https://www.pluralsight.com/guides/how-to-use-radio-buttons-in-reactjs
  */
  const handleChange = (e) => {
    const target = e.target;
    let value = target.value;
    const name = target.name;

    if (target.type == 'radio') {
      switch (value) {
        case 'family':
          setState({ relation: Relationships.familial });
          break;
        case 'friend':
          setState({ relation: Relationships.friendship });
          break;
        case 'acquaint':
          setState({ relation: Relationships.acquaintance });
          break;
        case 'romantic':
          setState({ relation: Relationships.romantic });
          break;
        case 'work':
          setState({ relation: Relationships.work });
          break;
        case 'undefined':
          setState({ relation: Relationships.situational });
          break;
      }
    } else {
      setState({ [name]: value });
      switch (name) {
        case 'name':
          name = value;
          break;
        case 'years':
          years = value;
          break;
        case 'notes':
          notes = value;
          break;
        case 'type':
          type = value;
          break;
        case 'relation':
          relation = value;
          break;
        case 'familiarity':
          familiarity = value;
          break;
        case 'stressLevel':
          stressLevel = value;
          break;
        case 'node1ID':
          node1ID = value;
          break;
        case 'node2ID':
          node2ID = value;
          break;
      }
    }
  };

  const handleSubmit = (e) => {
    // Will be replaced with code that will send the data back to the node
    console.log('Submitted Data: ');
    console.log('name: ' + name);
    console.log('years: ' + years);
    console.log('notes: ' + notes);
    console.log('type: ' + type);
    console.log('relation: ' + relation);
    console.log('familiarity: ' + familiarity);
    console.log('stressLevel: ' + stressLevel);

    e.preventDefault();
  };

  const setData = () => {
    if (props.NodeData) {
      let node_name, node_years, node_notes, node_type;
      [node_name, node_years, node_notes, node_type] = props.NodeData.getData();
      setState({
        name: node_name,
        years: node_years,
        notes: node_notes,
        type: node_type,
      });
    } else if (props.EdgeData) {
      let edge_cat, edge_fam, edge_stress, edge_1ID, edge_2ID;
      [edge_cat, edge_fam, edge_stress, edge_1ID, edge_2ID] = props.EdgeData.getData();
      setState({
        category: edge_cat,
        familiarity: edge_fam,
        stressLevel: edge_stress,
        node1ID: edge_1ID,
        node2ID: edge_2ID,
      });
    }
  };

  const changeView = (new_view) => {
    view = new_view;
    setState({ value: '' });
  };

  const selectView = () => {
    switch (view) {
      case sidebarView.none:
        return (
          <p className="m-4">
            This is a data sidebar. The data of the selected entity in the graph will appear here.
          </p>
        );
      case sidebarView.person:
        type = NodeType.person;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Person</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="textbox-sidebar"
              value={name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="years"
              placeholder="Age"
              value={years}
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
              value={notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case sidebarView.place:
        type = NodeType.place;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Place</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
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
              value={notes}
              onChange={handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case sidebarView.idea:
        type = NodeType.idea;
        return (
          <form onSubmit={handleSubmit}>
            <h1 className="m-2 text-center text-xl">Idea</h1>
            <input
              type="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="years"
              placeholder="Age/History"
              value={years}
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
              value={notes}
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
              value={familiarity}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="stressLevel"
              placeholder="Stress Level"
              value={stressLevel}
              onChange={handleChange}
              className="textbox-sidebar"
            />
            <div className="m-4 w-11/12 text-lg">
              <u>{node1ID}</u> is related to <u>{node2ID}</u>
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
};

export default SidebarForm;
