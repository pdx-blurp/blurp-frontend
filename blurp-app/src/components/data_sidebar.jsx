import React from 'react';
import SidebarForm from './sidebar_form.jsx';
import { SIDEBAR_VIEW } from '../constants/constants.ts';

class DataSidebar extends React.Component {
  constructor(props) {
    super(props);

    // State consists of a changing data-sidebar classname. These
    // changes cause the sidebar to expand/collapse.
    this.collapsed_classname = 'data-sidebar right-[-260px]';
    this.expanded_classname = 'data-sidebar right-[0px]';

    this.state = {
      view: SIDEBAR_VIEW.person,
      sidebar_classname: this.collapsed_classname,
    };

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.changeView = this.changeView.bind(this);

    this.child = React.createRef(); // ref to sidebar-form
    this.sidebar_ref = React.createRef(); // ref to the sidebar div
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  collapse = () => {
    this.setState({ sidebar_classname: this.collapsed_classname });
  };
  expand = () => {
    this.setState({ sidebar_classname: this.expanded_classname });
  };

  /* renderContent isn't actually necessary here as it works without it,
    but it's useful like this for updating the div and seeing it change */
  changeView = (new_view) => {
    this.setState({ view: new_view });
    this.expand();
  };

  // When clicked outside of sidebar, collapse it
  handleClickOutside(event) {
    if (this.sidebar_ref && !this.sidebar_ref.current.contains(event.target)) {
      this.collapse();
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    return (
      <>
        <div className="data-sidebar-frame">
          <div className={this.state.sidebar_classname} ref={this.sidebar_ref}>
            <SidebarForm
              ref={this.child}
              parent_node={this.props.node}
              parent_edge={this.edge}
              changeNodeData={this.props.changeNodeData}
            />
          </div>
        </div>
      </>
    );
  }
}

export default DataSidebar;
