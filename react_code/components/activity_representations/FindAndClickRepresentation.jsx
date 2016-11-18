import React, { PropTypes } from 'react';

export default class FindAndClickRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;

    let displayRepresentationWords = () => {
      return representation.answer.map((word, index) => {
        return (
          <div className="fac-selected-word" key={`fac-selected-word-${index}`}>
            <label>{index + 1}.</label>
            <input disabled="true" value={word} key={index}/>
          </div>
        );
      });
    };

    return (
      <div className="act-representation act-representation--fac">
        <div className="act-representation__item">
          {displayRepresentationWords()}
        </div>
      </div>
    );
  }
}
