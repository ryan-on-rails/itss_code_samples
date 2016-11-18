import React, { PropTypes } from 'react';
import { connect  }         from 'react-redux';
import * as AR              from '../activity_representations'

class Answer extends React.Component {
  static propTypes = {
    element: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { element } = this.props;
    if(!element.representation || element.representation.answer.length == 0){
      return (<div/>);
    }
    let heading = () => {
      switch(element.activity_category) {
        case 'Signaling':
          return 'Signaling Words';
        case 'Main Idea':
          return 'Main Idea';
        case 'Structure':
          return 'Structure';
        default:
          return 'Your Answer';
      }
    };

    let content = () => {
      if(!element.representation) { return (<div></div>); }

      switch(element.activity_type) {
        case 'CompositionActivity':
           return (<AR.CompositionRepresentation representation={element.representation} />);
        case 'FindAndClickActivity':
           return (<AR.FindAndClickRepresentation representation={element.representation} />);
        case 'QuestionAnswerActivity':
           return (<AR.QuestionAnswerRepresentation representation={element.representation} />);
        default:
           return (<div></div>);
      }
    };

    return (
      <div className="content-element ce-answer">
        <h2 className="ce-heading">{heading()}</h2>
        {content()}
      </div>
    );
  }
}

function select(state) {
  return { activity: state.activity };
}

export default connect(select)(Answer);
