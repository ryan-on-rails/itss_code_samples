import React, { PropTypes }         from 'react';
import { connect }                  from 'react-redux';
import { Modal }                    from 'react-bootstrap';
import * as AnswerUI                from './activity_representations';
import FeedbackScore                from './FeedbackScore';
import IntelligentTutor             from './IntelligentTutor';
import * as FeedbackActions         from '../actions/FeedbackActions';
import * as ActivityActions         from '../actions/ActivityActions';
import LanguagePrefixHelper         from '../helpers/LanguagePrefixHelper';

class Feedback extends React.Component {
  static propTypes = {
    feedback: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      feedbackRead: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ feedbackRead: false });
  }

  render() {
    const { feedback, activity, displayLanguage, user } = this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, feedback.feedback);

    if(!feedback || !feedback.response) {
      return (<span/>);
    }

    function answerUI() {
      let activityAnswerUI;

      if(!feedback.representation) {
        return (<span/>);
      }


      switch(activity.type) {
        case 'MatrixActivity':
          activityAnswerUI = (<AnswerUI.MatrixRepresentation representation={feedback.representation} activity={activity} />);
          break;
        case 'QuestionAnswerActivity':
          activityAnswerUI = (<AnswerUI.QuestionAnswerRepresentation representation={feedback.representation} />);
          break;
        case 'FindAndClickActivity':
          activityAnswerUI = (<AnswerUI.FindAndClickRepresentation representation={feedback.representation}/>);
          break;
        case 'FillInBlankActivity':
          activityAnswerUI = (<AnswerUI.FillInBlankRepresentation representation={feedback.representation}/>);
          break;
        case 'MultipleChoiceActivity':
          activityAnswerUI = (<AnswerUI.MultipleChoiceRepresentation representation={feedback.representation}/>);
          break;
        case 'CompositionActivity':
          activityAnswerUI = (<AnswerUI.CompositionRepresentation representation={feedback.representation} />);
          break;
        case 'TreeActivity':
          activityAnswerUI = (<AnswerUI.TreeRepresentation representation={feedback.representation} />);
          break;
        default:
          activityAnswerUI = (<AnswerUI.InfoRepresentation representation={feedback.representation} />);
          break;
      }
      
      return (
        <div className="feedback__answer">
          {activityAnswerUI}
        </div>
      );
    }
    return (
      <Modal show={feedback.showModal} onHide={e => {}} dialogClassName={'modal-dialog feedback-modal'}>
        <div className="feedback__top">
          {feedback.response.passing_score ? "" : <FeedbackScore feedback={feedback} activity={activity} />}
          <div className="feedback__text">
            <h2>{lph.assemble("text")}</h2>
          </div>
        </div>
        {answerUI()}
        <button className="o-btn-action" disabled={!this.state.feedbackRead}
          onClick={() => this.handleButtonClick()}>
          {(feedback.response.passing_score || feedback.feedback.slug === "moveon")? "Continue" : "Try Again"}
        </button>
        <IntelligentTutor monologue={feedback.feedback} hasBeenRead={false}
          onRead={() => this.handleFeedbackRead()} audioOnly={true} displayLanguage={displayLanguage} user={user} />
      </Modal>
    );
  }

  hideFeedback() {
    this.props.dispatch(ActivityActions.clearResponse());
    this.props.dispatch(FeedbackActions.hideFeedback());
  }

  handleButtonClick() {
    const { feedback } = this.props;

    if(feedback.response.passing_score || feedback.feedback.slug === "moveon") {
      this.props.dispatch(ActivityActions.clearResponse());
      this.hideFeedback();
      this.props.handleNextActivity();
    } else {
      this.hideFeedback();
    }
  }

  handleFeedbackRead() {
    this.setState({ feedbackRead: true });
  }
}

function select(state) {
  return {
    feedback: state.feedback,
    activity: state.activity
  };
}

export default connect(select)(Feedback);
