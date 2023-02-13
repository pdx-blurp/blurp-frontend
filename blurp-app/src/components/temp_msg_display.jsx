import React from 'react';

const HIDDEN_MSG_CLASS = 'obj-deleted-msg opacity-0';
const VISIBLE_MSG_CLASS = 'obj-deleted-msg opacity-100';


class TempMessage extends React.Component {
  
  constructor(props) {
    super(props);
    this.props = props;
    // Will read the message and duration when 'showMessage()' is called
    this.state = {
      msg: '',
      deleteMsgClass: HIDDEN_MSG_CLASS
    }
  }

  showMessage = () => {
    // Read props to see what to display and for how long
    this.setState({
      msg: this.props.message,
      deleteMsgClass: VISIBLE_MSG_CLASS
    });
    if(this.props.duration) {
      setTimeout(this.hideMessage, this.props.duration);
    }
    else {
      setTimeout(this.hideMessage, 1500);
    }
  }

  hideMessage = () => {
    this.setState({
      deleteMsgClass: HIDDEN_MSG_CLASS
    });
    console.log('hide');
  }

  render () {
    return (
      <>
        <div className={this.state.deleteMsgClass}>
          <p>{this.state.msg}</p>
        </div>
      </>
      )
  };
}

export default TempMessage;