import React, { PropTypes } from 'react';

export default class QuestionAnswerRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;

    return (
      <div className="act-representation act-representation--qa">
        <input type="textarea" disabled="disabled" value={representation.answer} />
      </div>
    );
  }
}
