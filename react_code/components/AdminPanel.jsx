import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import * as Actions         from '../actions/GlobalActions';

class AdminPanel extends React.Component {
  render() {
    const { activity, lessonList, lesson, user } = this.props;

    let lessons = () => {
      return lessonList.map((_lesson, index) => {
        let classname = (lesson.id == _lesson.id) ? "active" : "";

        return (
          <li className={classname} key={`lesson-${_lesson.id}`} >
            <a href="#" onClick={e => this.handleLessonClick(e, _lesson.id)}>
              {_lesson.title}
            </a>
          </li>
        );
      });
    };

    let activities = () => {
      return lesson.activities.map((_activity, index) => {
        let classname = (activity.id === _activity.id) ? "active" : "";
        return (
          <li className={classname} key={`activity-${_activity.id}`} >
            <a href="#" onClick={e => this.handleActivityClick(e, _activity.id)}>{(index+1)}</a>
          </li>
        );
      });
    };

    if(user.admin != true){
      return (<div/>);
    }

    return (
      <div className="admin-controls">
        <ul className="nav navbar-nav">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                {lesson.title}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                {lessons()}
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Activity {lesson.activities.map(a => a.id).indexOf(activity.id) + 1}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                {activities()}
              </ul>
            </li>
            <li>
              <button className="btn btn-danger clear-responses" onClick={e => this.handleClearClick(e)}>Clear Activity Responses</button>
            </li>
        </ul>
      </div>
    );
  }

  handleLessonClick(e, id) {
    e.preventDefault();
    this.props.dispatch(Actions.setUserLesson(id));
  }

  handleActivityClick(e, id) {
    e.preventDefault();
    const { dispatch, lesson } = this.props;
    dispatch(Actions.setUserActivity(id, lesson));
  }

  handleClearClick(e) {
    e.preventDefault();
    const { dispatch, activity } = this.props;

    if (confirm("Are you sure you want to delete your responses?")) {
      dispatch(Actions.clearUserResponses(activity.id));
    }
  }
}

function select(state) {
  return {
    user: state.user,
    lesson: state.lesson,
    lessonList: state.lesson_list,
    activity: state.activity
  };
}

export default connect(select)(AdminPanel);
