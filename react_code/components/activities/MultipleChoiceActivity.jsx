import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import * as ActivityActions     from '../../actions/ActivityActions';
import * as UserActions         from '../../actions/UserActions';
import MultipleChoiceResponse   from '../../models/responses/MultipleChoiceResponse';

class MultipleChoiceActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      response: new MultipleChoiceResponse(props.activity)
    };
  }

  componentWillReceiveProps(nextProps) {
    // Reset response if activity is different
    if(this.props.activity.id !== nextProps.activity.id) {
      this.setState({ response: new MultipleChoiceResponse(nextProps.activity) });
    }

    // // Update response
    // this.setState({ response: new MultipleChoiceResponse(nextProps.activity) });
  }

  render() {
    const { activity, responseDisabled, user } = this.props;
    if(activity.type != "MultipleChoiceActivity") {return(<div />);}
    
    let optionSetClass = `optionSet${activity.id}`;
    let options = activity.question.options.map((option, i) => {
      let className = this.state.response.hasAnswer(option) ? 'act-response__opt--selected' : '';

      return (
        <div className={`act-response__opt ${className}`}
          onClick={e => this.handleOptionClick(option)}>
          <label>{option.label}</label>
        </div>
      );
    });

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
      <div className="act-response act-response--mc">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <p className="act-response__instructions">
            {activity.question.content}
          </p>
          <div className="act-response__response">
            {options}
          </div>
        </div>
        {submitButton()}
      </div>
    );
  }

  handleOptionClick(option) {
    let response = this.state.response;
    const { user, activity, dispatch } = this.props;
    let monologueCount = activity.monologues.length

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.hasAnswer(option)) {
      response.removeAnswer(option);
    } else {
      response.addAnswer(option);
    }

    dispatch(ActivityActions.updateMultipleChoiceAnswers(response));
  }

  handleSubmit() {
    const { response } = this.state;

    if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please select at least one answer.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
}

function select(state) {
  return state;
}

export default connect(select)(MultipleChoiceActivity);