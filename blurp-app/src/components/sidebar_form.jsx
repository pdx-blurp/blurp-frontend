import React from 'react';
import { sidebarView, Relationships, NodeType, NodeData, EdgeData } from '../pages/blurpmap.jsx';

const notes_size = 255;

class SidebarForm extends React.Component {
  constructor(props) {
    super(props);
    this.NodeData = this.props.NodeData;
    this.EdgeData = this.props.EdgeData;

    this.state = {
      value: '',
      name: '',
      years: '',
      notes: '',
      type: NodeType.person,
      relation: Relationships.situational,
      familiarity: '',
      stressLevel: '',
    };
    this.view = this.props.view;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* 
    Using this to work on pulling info from the forms:
    https://reactjs.org/docs/forms.html

    And using the link below for how to handle radio buttons:
    https://www.pluralsight.com/guides/how-to-use-radio-buttons-in-reactjs
  */
  handleChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (target.type == 'radio') {
      switch (value) {
        case 'family':
          this.setState({ relation: Relationships.familial });
          break;
        case 'friend':
          this.setState({ relation: Relationships.friendship });
          break;
        case 'acquaint':
          this.setState({ relation: Relationships.acquaintance });
          break;
        case 'romantic':
          this.setState({ relation: Relationships.romantic });
          break;
        case 'work':
          this.setState({ relation: Relationships.work });
          break;
        case 'undefined':
          this.setState({ relation: Relationships.situational });
          break;
      }
    } else {
      this.setState({ [name]: value });
    }
  }

  handleSubmit(event) {
    console.log('Submitted Data: ');
    console.log('name: ' + this.state.name);
    console.log('years: ' + this.state.years);
    console.log('notes: ' + this.state.notes);
    console.log('type: ' + this.state.type);
    console.log('relation: ' + this.state.relation);
    console.log('familiarity: ' + this.state.familiarity);
    console.log('stressLevel: ' + this.state.stressLevel);

    event.preventDefault();
  }

  changeView(new_view) {
    this.view = new_view;
    this.setState({ value: '' });
  }

  selectView() {
    switch (this.view) {
      case sidebarView.none:
        return (
          <p>
            This is a data sidebar. The data of the selected entity in the graph will appear here.
          </p>
        );
      case sidebarView.person:
        this.type = NodeType.person;
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Person</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="textbox-sidebar"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <input
              type="number"
              name="years"
              placeholder="Age"
              value={this.state.years}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={this.state.notes}
              onChange={this.handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case sidebarView.place:
        this.type = NodeType.place;
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Place</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={this.state.notes}
              onChange={this.handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case sidebarView.idea:
        this.type = NodeType.idea;
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Idea</h1>
            <input
              type="name"
              name="name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="years"
              placeholder="Age/History"
              value={this.state.years}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <textarea
              type="text"
              name="notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              value={this.state.notes}
              onChange={this.handleChange}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case sidebarView.edge:
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Edges/Relationships</h1>
            <div className="m-2 w-11/12" onChange={this.handleChange}>
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
              value={this.state.familiarity}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <input
              type="number"
              name="stressLevel"
              placeholder="Stress Level"
              value={this.state.stressLevel}
              onChange={this.handleChange}
              className="textbox-sidebar"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      default:
        // aligns with closed state, shouldn't happen but wanted to guard it
        return <></>;
    }
  }

  render() {
    return <>{this.selectView()}</>;
  }
}

export default SidebarForm;
