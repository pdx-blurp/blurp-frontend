import React from 'react';
import SidebarForm from './sidebar_form.jsx';
import { sidebarView, NodeData, NodeType, EdgeData } from '../pages/blurpmap.jsx';

const sidebarState = {
  closed: 'closed',
  expanded: 'expanded',
};
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
      content: this.renderContent(sidebarState.closed, sidebarView.none),
      view: sidebarView.closed,
    };
    // In the future this will be passed through from blurpmap, as the data
    // will be coming from the map
    this.node = new NodeData('wow, a test!', 21, 'testing', NodeType.person);
    this.edge = null;
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

  onClickFunction = () => {
    this.child.current?.clearState();
  };

  /* 
    probably isn't needed anymore, just have it like this for now while
    working on the form 
  */
  getSidebar(view) {
    if (view == sidebarView.closed) {
      return <></>;
    } else {
      return (
        <div className="data-sidebar-background grid justify-items-center">
          <SidebarForm
            ref={this.child}
            view={view}
            parent_node={this.node}
            parent_edge={this.edge}
          />
        </div>
      );
    }
  }

  collapse = () => {
    this.setState({
      content: this.renderContent(sidebarState.closed, this.state.view),
    });
  };

  expand = () => {
    if (this.state.view == sidebarView.closed) {
      this.setState({
        view: sidebarView.none,
        content: this.renderContent(sidebarState.open, sidebarView.none),
      });
    } else {
      this.setState({
        content: this.renderContent(sidebarState.open, this.state.view),
      });
    }
  };

  /* renderContent isn't actually necessary here as it works without it,
    but it's useful like this for updating the div and seeing it change */
  changeView(new_view) {
    if (new_view != sidebarView.closed) {
      this.setState({
        content: this.renderContent(sidebarState.open, new_view),
        view: new_view,
      });
    } else {
      this.setState({
        content: this.renderContent(sidebarState.closed, sidebarView.closed),
        view: new_view,
      });
    }
    /* Works, but will clear data after the new data has been loaded in, so
       probably need to play around with it and see what works best */
    // this.onClickFunction();
  }

  renderContent(status, view) {
    /* Fancy way to do an if/else statement, doing it since I was having issues
      getting variables to stay changed outside an if statement
      https://stackoverflow.com/questions/31971801/setting-a-javascript-variable-with-an-if-statement-should-the-var-x-be-in
    */
    let barState = status === sidebarState.open ? 1 : 0;

    return (
      <>
        <div className={this.data_sidebar[barState]}>
          <div className="data-sidebar-tab" onClick={this.onclick[barState]}>
            <svg className="data-sidebar-tab-arrow" fill="currentColor">
              <polygon points={this.svg_coods[barState]} />
            </svg>
          </div>
          {this.getSidebar(view)}
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
        <button className="btn-primary m-10" onClick={this.node.display}>
          display
        </button>
        <button className="btn-primary m-10" onClick={this.testFunction}>
          testing
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(sidebarView.none)}>
          None
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(sidebarView.person)}>
          Person Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(sidebarView.place)}>
          Place Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(sidebarView.idea)}>
          Idea Node
        </button>
        <button className="btn-primary m-10" onClick={() => this.changeView(sidebarView.edge)}>
          Edge/Relationship
        </button>
      </>
    );
  }
}

export default DataSidebar;
