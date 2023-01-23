import React from 'react';
import SidebarForm from './sidebar_form.jsx';

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
    this.state = {
      content: this.renderContent(0, 0),
      view: 0,
    };
    // https://chafikgharbi.com/react-call-child-method/
    this.child = React.createRef();
    /* 
      Used this to pull data from the form elements without it clearing 
      the textbox:
      https://stackoverflow.com/questions/69092720/cant-type-in-react-textfield-input 
    */
    this.expand = this.expand.bind();
    this.collapse = this.collapse.bind(this);
  }

  /* 
    probably isn't needed anymore, just have it like this for now while
    working on the form 
  */
  getSidebar(selection) {
    if (selection == 0) {
      return <></>;
    } else {
      return (
        <div className="data-sidebar-background grid justify-items-center">
          <SidebarForm ref={this.child} view={selection} />
        </div>
      );
    }
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
      if (this.child.current) {
        this.child.current.changeView(new_view);
      }
    } else {
      this.setState({
        content: this.renderContent(0, 0),
        view: new_view,
      });
    }
  }

  /* Generates code for the div. Takes a few arguments:
    expanded:  0 = collapsed, 
               1 = expanded
    selection: 0 = collapsed, 
               1 = no selection, 
               2 = person node selected, 
               3 = place node selected,
               4 = idea node selected,
               5 = edge/relationship selected

    would like to replace both of these with enums in the future,
    but an initial glance at JS enums made them seem not great for this
  */
  renderContent(expanded, selection) {
    return (
      <>
        <div className={this.data_sidebar[expanded]}>
          <div className="data-sidebar-tab" onClick={this.onclick[expanded]}>
            <svg className="data-sidebar-tab-arrow" fill="currentColor">
              <polygon points={this.svg_coods[expanded]} />
            </svg>
          </div>
          {this.getSidebar(selection)}
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        {this.state.content}

        {/* Below are buttons used for testing each individual sidebar view
         */}
        <button className="btn-primary m-10" onClick={() => this.changeView(1)}>
          None
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(2)}>
          Person Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(3)}>
          Place Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(4)}>
          Idea Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(5)}>
          Edge/Relationship
        </button>
      </>
    );
  }
}

export default DataSidebar;
