import React, { PropTypes } from 'react';

export default class CompositionRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;
    if(representation.answer[0].content == null){return(<span/>);}

    let content = () => {
      return representation.answer.map((answer, key) => {
        if(answer.content == null || answer.content == ""){return;}
        return (
          <div key={key}>
            <div className="act-representation__item">
              <label>{answer.question}</label>
              <textarea rows="4" className="form-input"
                disabled="true" value={answer.content} />
            </div>
          </div>
        );
      });
    };

    return (
      <div className="act-representation act-representation--composition">
        {content()}
      </div>
    );
  }
}
