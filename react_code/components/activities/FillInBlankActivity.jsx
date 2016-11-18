import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import * as ActivityActions   from '../../actions/ActivityActions';
import * as UserActions       from '../../actions/UserActions';
import FillInBlankResponse    from '../../models/responses/FillInBlankResponse';

class FillInBlankActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      response: new FillInBlankResponse(props.activity)
    };
  }

  componentWillReceiveProps(nextProps) {
    // Reset response if activity is different
    if(this.props.activity.id !== nextProps.activity.id) {
      this.setState({ response: new FillInBlankResponse(nextProps.activity) });
    }
  }

  render() {
    const { activity, responseDisabled, user } = this.props;
    if(activity.type != "FillInBlankActivity") {return(<div />);}

    let createTextWithBlankFields = () => {
      let { content, fill_in_blank_fields: fields } = activity.question;

      let is_disabled = user.preferred_language != "en";
      let contentArr = content.split(/\s/);
      let processedContent = contentArr.map((str, key) => {
        let match = str.match(/@\((\d+)\)(.*)/);

        if(match) {
          let [_, index, theRest] = match;
          let after = theRest + ' ';

          return (
            <span key={key}>
              <input type="text" className="fib-input" 
                disabled={is_disabled}
                dataFieldId={fields[+index - 1].id}
                onChange={(e) => this.handleFieldChange(e, +index - 1)} />
              {after}
            </span>
          );
        } else {
          return (<span key={key}>{str} </span>);
        }
      });

      return (<div>{processedContent}</div>);
    }

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
      <div className="act-response act-response--fib">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <p className="act-response__instructions">
            Complete the pattern by filling in the blanks below.
          </p>
          <div className="act-response__question act-response__response">
            {createTextWithBlankFields()}
          </div>
        </div>
        {submitButton()}
      </div>
    );
  }

  handleFieldChange(e, index) {
    let response = this.state.response;
    response.answers[index].content = e.target.value;
    this.setState({ response: response });
  }

  handleSubmit() {
    let { response } = this.state;
    const { user, activity, dispatch } = this.props;
    let monologueCount = activity.monologues.length;

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please fill in all of the blanks.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
}

function select(state) {
  return state;
}

export default connect(select)(FillInBlankActivity);
