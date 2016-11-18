import React, { PropTypes }   from 'react';
import { ProgressBar }        from 'react-bootstrap';

export default class FeedbackScore extends React.Component {
  render() {
    const { feedback, activity } = this.props;
    let response = feedback.response;

    let imgPath = () => {
      let basePath = '/media/activity';

      switch(activity.category) {
        case 'Main Idea':
          return `${basePath}/main-idea.svg`;
        case 'Signaling':
          return `${basePath}/signal-words.svg`;
        case 'Structure':
          return `${basePath}/structure.svg`;
        case 'Recall':
          return `${basePath}/recall.svg`;
        default:
          return `${basePath}/structure.svg`;
      }
    };

    let scorePercent = () => {
      switch(activity.category) {
      case 'Main Idea': 
        return (response.signal_score + response.main_idea_score + response.detail_score) / 3;
      case 'Recall':
        return (response.signal_score + response.main_idea_score + response.detail_score) / 3;
      case 'Signaling':
        return response.signal_score;
      case 'Structure':
        return response.structure_score;
      default:
        return 0;
      }
    };

    return (
      <div className="feedback-score">
        <img className="feedback-score__img" src={imgPath()} />
        <div className="feedback-score__content">
          <h3 className="feedback-score__heading">Your Score</h3>
          <div className="feedback-score__progress">
            <ProgressBar now={scorePercent()}
              label='%(percent)s%' srOnly />
          </div>
        </div>
      </div>
    );
  }

}