import React, { PropTypes } from 'react';

export default class LoadingOverlay extends React.Component {
  static propTypes = {
    loading: PropTypes.any.isRequired
  };

  render() {
    const { loading } = this.props;
    const style = {
      display: loading ? 'block' : 'none'
    };

    const content = () => {
      if(loading) {
        return (
          <div className="itss-loading">
            <div className="itss-loading__inner">
              {this.props.children}
            </div>
          </div>
        );
      }
    };

    return (
      <div className="act-loading-overlay" style={style}>
        {content()}
      </div>
    );
  }
}
