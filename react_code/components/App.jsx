import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';

import Instructions           from './Instructions';
import Divider                from './Divider';
import ActivityContent        from './ActivityContent';
import ActivityWorkspace      from './ActivityWorkspace';
import AdminPanel             from './AdminPanel';
import Feedback               from './Feedback';
import LessonCheckpoint       from './LessonCheckpoint';
import LessonIntro            from './LessonIntro';
import LoadingOverlay         from './LoadingOverlay';
import ProgressBar            from './ProgressBar';
import VideoInstructions      from './VideoInstructions';

import * as ActivityActions   from '../actions/ActivityActions';
import * as PanelActions      from '../actions/PanelActions';
import * as GlobalActions     from '../actions/GlobalActions';
import * as UserActions       from '../actions/UserActions';

import * as AppUtils          from '../lib/AppUtils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowPanelResize: false,
    };
  }

  componentDidMount() {
    let workspaceNode = AppUtils.getWorkspaceNode();
    if(this.state.allowPanelResize) {
      workspaceNode.addEventListener('mouseup', (e) => this.onMouseUp(e));
      workspaceNode.addEventListener('mousemove', (e) => this.onMouseMove(e));
      workspaceNode.addEventListener('touchend', (e) => this.onMouseUp(e));
      workspaceNode.addEventListener('touchmove', (e) => this.onMouseMove(e));
    }
  }

  render() {
    const { dispatch, activity, page, user,
      lesson, panels, feedback, progress, contentLoading } = this.props;

    let isInfoActivity = activity.type === 'InfoActivity';
    let parentClassName = isInfoActivity ? 'act-workspace--info' : '';
    let programIntroActive = !user.watched_intro;
    let styles;
    let hideToggle = (!activity.instructionsRead && activity.monologues.length) || activity.responding;

    // This is used when a student is on some sort of activity that requires submission
    //  and therefore must be in English
    let forceEnglish = () => {
      user.preferred_language = "en";
    }
    let languageToggle = () => {
      if (!user.is_hybrid || hideToggle ) {
        return;
      } else {
        return (
          <div className="language-selector-container">
            <ul className="nav navbar-nav navbar-right  language-selector">
              <li><a href="#" onClick={(e) => this.handleLanguageClickInstruction(e,"en")} className={`language en ${(user.preferred_language == "en" ? "active": "")}`}>English</a></li>
              <li><a href="#" onClick={(e) => this.handleLanguageClickInstruction(e, "es")} className={`language es ${(user.preferred_language == "es" ? "active": "")}`}>Spanish</a></li>
            </ul>
          </div>
        );
      }
    }

    if(isInfoActivity) {
      styles = {
        panelLeft: { right: '0%' },
        panelRight: { left: '50%' }
      };
    } else if(page.content_elements.length === 0){
      parentClassName = parentClassName + ' act-workspace--full';
      //forceEnglish();
      styles = {
        panelLeft: { right: (100 - panels.percentage) + '%' },
        panelRight: { left: '0%' }
      };
    } else {
      //forceEnglish();
      styles = {
        panelLeft: { right: (100 - panels.percentage) + '%' },
        panelRight: { left: panels.percentage + '%' }
      };
    }

    if(ENV.development) {
      // NOTE: Skip lesson intro in development
      // activity.first_in_lesson = false;
    }

    return (
      <div className="itss-app">
        {languageToggle()}
        <div className={`act-workspace ${parentClassName}`}>
          <div className="act-workspace__area act-workspace__area--left">
             <Instructions onNext={() => this.handleNextInstruction()} activity={activity} lesson={lesson}
                autoPlay={!programIntroActive} programIntroActive={programIntroActive} displayLanguage={user.preferred_language} user={user} />
          </div>
          <div className="act-workspace__area act-workspace__area--right">
            <div className="act-panel act-panel--mid" style={styles.panelLeft}>
              <ActivityContent elements={page.content_elements} activity={activity} displayLanguage={user.preferred_language}/>
              <Divider onResizeStart={() => dispatch(PanelActions.startPanelResizing())} />
            </div>
            <div className="act-panel act-panel--right" style={styles.panelRight}>
              <ActivityWorkspace />
            </div>
            <div className="act-bottom-bar">
              <ProgressBar lesson={lesson} activity={activity} progress={progress} displayLanguage={user.preferred_language}/>
            </div>
            <LessonIntro lesson={lesson} show={activity.first_in_lesson}
              onIntroEnd={this.handleIntroEnd.bind(this)}  displayLanguage={user.preferred_language} user={user} />
            <Modal dialogClassName="modal-dialog video-instructions-modal" show={programIntroActive} onHide={e => {}} >
              <VideoInstructions onContinue={() => this.handleProgramIntroWatched()} />
            </Modal>
            <Feedback feedback={feedback} activity={activity} handleNextActivity={() => this.handleNextActivity()} displayLanguage={user.preferred_language} user={user} />
            <LessonCheckpoint lesson={lesson}
              handleNextActivity={() => this.handleNextActivity()} />
          </div>
          <AdminPanel />
          <LoadingOverlay loading={contentLoading}>
            <span>Loading Lesson Content...</span>
          </LoadingOverlay>
        </div>
      </div>
    );
  }

  handleNextActivity() {
    this.props.dispatch(GlobalActions.moveForward(this.props));
  }

  onMouseUp() {
    this.props.dispatch(PanelActions.stopPanelResizing());
  }

  onMouseMove(e) {
    let panelMidPercent;
    let panels = this.props.panels.toJS();

    // Update panel position properties using mouse
    // position data; effect is zero-sum panel resizing
    if(panels.resizing) {
      panelMidPercent = AppUtils.getPanelPercent(e);

      // Prevent resizing beyond 20/80 ratio
      if(panelMidPercent < 20 || panelMidPercent > 80) { return; }
      this.props.dispatch(PanelActions.setPanelPercentage(panelMidPercent));
    }
  }

  handleIntroEnd() {
    this.props.dispatch(ActivityActions.activateCurrentActivity());
  }

  handleProgramIntroWatched() {
    const { dispatch, lesson } = this.props;

    dispatch(UserActions.setWatchedIntro());

    // If the lesson does not have a lesson intro,
    // we need to trigger the first activity
    if(!lesson.monologues.length) {
      dispatch(ActivityActions.activateCurrentActivity());
    }
  }

  handleNextInstruction() {
    this.props.dispatch(ActivityActions.setNextInstruction());
  }
  handleLanguageClickInstruction(e, language_abbv) {
    e.preventDefault();
    const { dispatch, user, activity } = this.props;
    if(user.preferred_language != language_abbv && activity.monologues.length > 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:language_abbv}));
    } else {
      dispatch(UserActions.setPreferredLanguage(language_abbv));
    }
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(App);
