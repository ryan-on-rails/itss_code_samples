import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import * as ActivityActions   from '../../actions/ActivityActions';
import * as UserActions       from '../../actions/UserActions';
import QuestionAnswerResponse from '../../models/responses/QuestionAnswerResponse';

class QuestionAnswerActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      response: new QuestionAnswerResponse(props.activity)
    };
  }

  componentWillReceiveProps(nextProps) {
    // Reset response if activity is different
    if(this.props.activity.id !== nextProps.activity.id) {
      this.setState({ response: new QuestionAnswerResponse(nextProps.activity) });
    }
  }

  render() {
    const { activity, responseDisabled, user } = this.props;
    if(activity.type != "QuestionAnswerActivity") {return(<div />);}
    let is_disabled = user.preferred_language != "en";

    let submitButton = () => {
      let popover = (<Popover id="popover-positioned-top" className="es-continue-button-popover">Las preguntas son contestadas solamente en las páginas en inglés.</Popover>);
      let submitText = "Submit";
      if(user.preferred_language == "es") {
        submitText = "Inglés";
        return (
          <OverlayTrigger trigger={['hover', 'focus']}
            placement="top" overlay={popover}>
            <button disabled={responseDisabled}
              className="act-response__submit-btn o-btn-action"
              onClick={() => this.handleSubmit()}>
              {submitText}
            </button>
          </OverlayTrigger>
        );
      } else {
        return (
          <button disabled={responseDisabled}
            className="act-response__submit-btn o-btn-action"
            onClick={() => this.handleSubmit()}>
            {submitText}
          </button>
        );
      }
    };

    return (
      <div className="act-response act-response--qa">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <p className="act-response__instructions">
            Answer the question by typing in the box
          </p>
          <div className="act-response__question">
            {activity.question.content}
          </div>
          <div className="act-response__response">
            <input type="text" className="col-md-12"
              disabled={is_disabled}
              onChange={(e) => this.handleFieldChange(e)} value={this.state.response.answer.content} />
          </div>
        </div>
        {submitButton()}
      </div>
    );
  }

  handleFieldChange(e) {
    let response = this.state.response;
    response.answer.content = e.target.value;
    this.setState({ response: response });
  }

  handleSubmit() {
    let { response } = this.state;
    const { user, activity, dispatch } = this.props;
    let monologueCount = activity.monologues.length

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please provide an answer in the field below.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
}

function select(state) {
  return state;
}

export default connect(select)(QuestionAnswerActivity);
