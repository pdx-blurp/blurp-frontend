import React from 'react';

const notes_size = 255;

class DataSidebar extends React.Component {
  constructor(props) {
    super(props);

    // Each of the four specifications below is an array: [collapsed, expanded].
    // The first element is what the specification is when the data-sidebar is collapsed,
    // and the second element is when it's expanded.
    //
    // className for the main sidebar div
    this.data_sidebar = ['data-sidebar w-[15px]', 'data-sidebar'];
    // svg coordinates for the collapse/expand arrow on the tab/button
    this.svg_coods = ['12,20 12,40 3,30', '4,20 4,40 13,30'];
    // Function to be called when the tab/button is clicked
    this.onclick = [this.expand, this.collapse];
    // The content to appear inside the collapsable div
    this.inside_content = [
      <></>,
      <div className="data-sidebar-background grid justify-items-center">
        <p>
          This is a data sidebar. The data of the selected entity in the graph will appear here.
        </p>
      </div>,
      <div className="data-sidebar-background grid justify-items-center">
        <form>
          <input type="name" placeholder="Name" className="textbox-sidebar" />
          <input type="number" placeholder="Age" className="textbox-sidebar" />
          <input type="text" placeholder="Type" className="textbox-sidebar" />
          <textarea
            name="Notes"
            className="textbox-sidebar resize-none"
            rows="10"
            cols="25"
            maxLength={notes_size}
            placeholder="Notes"
          />
        </form>
        <button className="btn-sidebar">Save</button>
      </div>,
    ];
    /* Button is only in the sidebar temporarily, I'm intending to use it to 
    check if its able to pull info from the form later */

    this.name = '';

    this.state = {
      content: this.renderContent(1, 2),
      view: 2,
    };
    this.expand = this.expand.bind();
    this.collapse = this.collapse.bind(this);
  }

  collapse = () => {
    this.setState({
      content: this.renderContent(0, this.state.view),
    });
  };

  expand = () => {
    if (this.state.view == 0) {
      this.setState({
        view: 1,
        content: this.renderContent(1, 1),
      });
    } else {
      this.setState({
        content: this.renderContent(1, this.state.view),
      });
    }
  };

  /* renderContent isn't actually necessary here as it works without it,
    but it's useful like this for updating the div and seeing it change */
  changeView(new_view) {
    if (new_view != 0) {
      this.setState({
        content: this.renderContent(1, new_view),
        view: new_view,
      });
    } else {
      this.setState({
        content: this.renderContent(0, 0),
        view: new_view,
      });
    }
  }

  // Generates code for the div. Takes an argument: 0 if collapsed, 1 if expanded
  renderContent(expanded, selection) {
    console.log(expanded, selection);

    return (
      <>
        <div className={this.data_sidebar[expanded]}>
          <div className="data-sidebar-tab" onClick={this.onclick[expanded]}>
            <svg className="data-sidebar-tab-arrow" fill="currentColor">
              <polygon points={this.svg_coods[expanded]} />
            </svg>
          </div>
          {this.inside_content[selection]}
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        {this.state.content}
        <button className="btn-primary m-10" onClick={() => this.changeView(0)}>
          Closed
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(1)}>
          None
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(2)}>
          Node
        </button>
      </>
    );
  }
}

export default DataSidebar;
