import React, { PropTypes } from 'react';

export default class FillInBlankRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;

    if(!representation) { return (<div></div>); }
    return (
      <div className="act-representation act-representation--info">
        <div className="act-representation__item">
          <div>{representation.answer}</div>
        </div>
      </div>
    );
  }
}
