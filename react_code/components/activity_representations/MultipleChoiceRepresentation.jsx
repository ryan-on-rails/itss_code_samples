import React, { PropTypes } from 'react';

export default class MultipleChoiceRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;

    let displayCorrectOptions = () => {
      return representation.answer.map((optionLabel) => {
        return (
          <div className="act-response__opt">
            <label>{optionLabel}</label>
          </div>
        );
      });
    };

    return (
      <div className="act-representation act-representation--mc">
        <div className="act-representation__item">
          {displayCorrectOptions()}
        </div>
      </div>
    );
  }
}
