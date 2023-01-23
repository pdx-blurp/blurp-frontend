import React from 'react';

const notes_size = 255;

class SidebarForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'test' };
    this.view = this.props.view;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* 
    Using this to work on pulling info from the forms:
    https://reactjs.org/docs/forms.html
  */
  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log(this.state.value);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  changeView(new_view) {
    this.view = new_view;
  }

  selectView() {
    console.log('view: ' + this.view);
    switch (this.view) {
      case 1:
        return (
          <p>
            This is a data sidebar. The data of the selected entity in the graph will appear here.
          </p>
        );
      case 2:
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Person</h1>
            <input
              type="text"
              name="person_name"
              placeholder="Name"
              className="textbox-sidebar"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <input type="number" placeholder="Age" className="textbox-sidebar" />
            <input type="text" placeholder="Misc." className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <textarea
              name="Notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Place</h1>
            <input
              type="text"
              placeholder="Name"
              defaultValue={this.state.place_name}
              className="textbox-sidebar"
            />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <textarea
              name="Notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case 4:
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Idea</h1>
            <input type="name" placeholder="Name" className="textbox-sidebar" />
            <input type="number" placeholder="Age/History" className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <textarea
              name="Notes"
              className="textbox-sidebar resize-none"
              rows="10"
              cols="25"
              maxLength={notes_size}
              placeholder="Notes"
            />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
      case 5:
        return (
          <form onSubmit={this.handleSubmit}>
            <h1>Edges/Relationships</h1>
            <div className="m-2 w-11/12">
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
            <input type="number" placeholder="Familiarity" className="textbox-sidebar" />
            <input type="number" placeholder="Stress Level" className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <input type="text" placeholder="Type" className="textbox-sidebar" />
            <button type="submit" className="btn-sidebar">
              Save
            </button>
          </form>
        );
    }
  }

  render() {
    return <>{this.selectView()}</>;
  }
}

export default SidebarForm;
