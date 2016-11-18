import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import { Alert, Modal, Button, OverlayTrigger, Popover }            from 'react-bootstrap';
import * as UI              from './activities';
import * as ActivityActions from '../actions/ActivityActions';
import * as UserActions     from '../actions/UserActions';
import InfoResponse         from '../models/responses/InfoResponse';

class ActivityWorkspace extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activity,user } = this.props;
    if(typeof activity == "undefined" || activity == null){ return(<div className="act-panel__inner"/>);}

    let responseDisabled = (!activity.instructionsRead && activity.monologues.length) || activity.responding;

    let alertUI = () => {
      if(activity.alertVisible) {
        return (
          <Modal.Dialog bsStyle="warning" backdrop="true" onDismiss={() => this.handleAlertDismiss()}>
            <Modal.Header closeButton="true" onHide={() => this.handleAlertDismiss()}>
              <Modal.Title>Oops..</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {activity.alertMessage}
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => this.handleAlertDismiss()}>Close</Button>
            </Modal.Footer>

          </Modal.Dialog>
        );
      }
    };

    let infoSubmitButton = () => {
      let popover = (<Popover id="popover-positioned-top" className="es-continue-button-popover">Las preguntas son contestadas solamente en las páginas en inglés.</Popover>);
      let submitText = "Continue";
      if(user.preferred_language == "es") {
        submitText = "Continuar";
        return (
          <OverlayTrigger trigger={['hover', 'focus']}
            placement="top" overlay={popover}>
            <button disabled={responseDisabled}
              className="act-response__submit-btn o-btn-action"
              onClick={(r) => this.handleSubmit(new InfoResponse(activity))}>
              {submitText}
            </button>
          </OverlayTrigger>
        );
      } else {
        return (
          <button disabled={responseDisabled}
            className="act-response__submit-btn o-btn-action"
            onClick={(r) => this.handleSubmit(new InfoResponse(activity))}>
            {submitText}
          </button>
        );
      }
    };

    let activityUI = () => {
      switch(activity.type) {
        case 'InfoActivity':
          return (infoSubmitButton());
        case 'CompositionActivity':
          return (<UI.CompositionActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'QuestionAnswerActivity':
          return (<UI.QuestionAnswerActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'MultipleChoiceActivity':
          return (<UI.MultipleChoiceActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'FillInBlankActivity':
          return (<UI.FillInBlankActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'MatrixActivity':
          return (<UI.MatrixActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'FindAndClickActivity':
          return (<UI.FindAndClickActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        case 'TreeActivity':
          return (<UI.TreeActivity onSubmit={(r) => this.handleSubmit(r)} alertUI={alertUI}
            responseDisabled={responseDisabled} />);
        default:
          return (<UI.InfoActivity onSubmit={(r) => this.handleSubmit(r)} />);
      }
    };

    return (
      <div className="act-panel__inner">
        {activityUI()}
      </div>
    );
  }

  handleSubmit(response) {
    const { dispatch, state, activity, user } = this.props;
    dispatch(ActivityActions.hideAlert());
    if(user.preferred_language == "en" || activity.type == "InfoActivity"){
      dispatch(ActivityActions.submitResponse(response, this.props));
    }else{
      // should be in the other activity layouts, placing here as a backup
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:language_abbv}));
    }
  }

  handleAlertDismiss() {
    this.props.dispatch(ActivityActions.hideAlert());
  }
}

function select(state) {
  return state;
}

export default connect(select)(ActivityWorkspace);
