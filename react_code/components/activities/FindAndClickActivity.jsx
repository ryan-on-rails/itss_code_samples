import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import * as ActivityActions from '../../actions/ActivityActions';
import * as UserActions     from '../../actions/UserActions';
import FindAndClickResponse from '../../models/responses/FindAndClickResponse';

class FindAndClickActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  render() {
    const { activity, responseDisabled, user } = this.props;
    if(activity.type != "FindAndClickActivity") {return(<div />);}

    let selectedWords = activity.selectedWords || [];
    let displaySelectedWords = () => {
      return activity.question.words.map((word, index) => {
        let w = selectedWords[index] || '';

        return (
          <div className="fac-selected-word" key={`faci-${index}`} >
            <label>{index+1 }.</label>
            <input disabled="true" value={w.replace(/^[\.,?!;")(*&@:%]+|[\.,?!;")(*&@:%]+$/, "")} />
            { w ? <span className="remove-word btn" onClick={() => this.handleWordClick(w)} ><i className="fa fa-times"></i></span> : null }
          </div>
        );
      }, this);
    };

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
      <div className="act-response act-response--fac">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <div className="act-response__instructions">
            {activity.question.content}
          </div>
          <div className="act-response__response">
            {displaySelectedWords()}
          </div>
        </div>
        {submitButton()}
      </div>
    );
  }

  handleWordClick(word) {
    jQuery(`.content-element .ce-word--selected.${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}`).last().removeClass("ce-word--selected");
    this.props.dispatch(ActivityActions.removeSelectedWord(word));
  }

  handleSubmit() {
    const { user, dispatch, activity } = this.props;
    let response = new FindAndClickResponse(activity);
    let monologueCount = activity.monologues.length;

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please select the indicated number of words.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
}

function select(state) {
  return state;
}

export default connect(select)(FindAndClickActivity);
