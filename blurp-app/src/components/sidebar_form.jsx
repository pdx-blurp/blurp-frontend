import React from 'react';

const notes_size = 255;

class SidebarForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'test' };
    this.view = props.view;

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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
  }
}

export default SidebarForm;
