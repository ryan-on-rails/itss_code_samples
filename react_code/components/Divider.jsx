import React, { PropTypes } from 'react';

export default class Divider extends React.Component {
  static propTypes = {
    onResizeStart: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="act-panel__divider"
        onMouseDown={this.props.onResizeStart}
        onTouchStart={this.props.onResizeStart}>
      </div>
    );
  }
}
