import React, { PropTypes }   from 'react';
import { bindActionCreators } from 'redux';
import { Modal }              from 'react-bootstrap';
import IntelligentTutor       from './IntelligentTutor';
import Key                    from './Key';
import VideoInstructions      from './VideoInstructions';

export default class Instructions extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired,
    lesson: PropTypes.any.isRequired,
    onNext: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showKeyModal: false,
      showVideoInstructions: false
    };
  }

  render() {
    const { monologueIndex } = this.state;
    const { activity, lesson, autoPlay, programIntroActive, displayLanguage, user } = this.props;
    const instructionIndex = activity.instructionIndex || 0;
    const instructionsRead = activity.instructionsRead;
    let monologue;

    if(activity.active && !programIntroActive) {
      monologue = activity.monologues[instructionIndex] || {};
      monologue.autoPlay = (instructionIndex !== 0 || !instructionsRead) && autoPlay;
    }

    let hasBeenRead = instructionIndex === 0 && instructionsRead;

    return (
      <div className="act-panel act-panel--left">
        <Modal show={this.state.showKeyModal} onHide={e => this.hideKey(e)}
          dialogClassName={'modal-dialog key-modal'}>
          <div className="modal-close-instructions">Please click anywhere outside of this box to close this window.</div>
          <Key lesson={lesson} />
        </Modal>
        <Modal show={this.state.showVideoInstructions} onHide={e => this.hideVideoInstructions(e)}
          dialogClassName={'modal-dialog video-instructions-modal'}>
          <div className="modal-close-instructions">Please click anywhere outside of this box to close this window.</div>
          <VideoInstructions onContinue={() => this.hideVideoInstructions()}
            hideContinue={true} />
        </Modal>
        <div className="act-panel__inner">
          <IntelligentTutor monologue={monologue} hasBeenRead={hasBeenRead} onRead={() => this.handleMonologueRead()}  displayLanguage={displayLanguage} user={user} />
          <p className="act-instruction__text">{activity.instructions}</p>
          <div className="act-instruction__btns">
            <button className="act-key-btn" onClick={e => this.showKey(e)}>
            </button>
            <button className="act-review-btn" onClick={e => this.showVideoInstructions(e)}>
            </button>
          </div>
        </div>
      </div>
    );
  }

  handleMonologueRead(e) {
    this.props.onNext();
  }

  showKey(e) {
    this.setState({ showKeyModal: true });
  }

  hideKey(e) {
    this.setState({ showKeyModal: false });
  }

  showVideoInstructions(e) {
    this.setState({ showVideoInstructions: true });
  }

  hideVideoInstructions(e) {
    this.setState({ showVideoInstructions: false });
  }
}
