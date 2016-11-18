import React        from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import { Link }            from 'react-router'

class CourseOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {  };
  }

  componentDidMount() {
    //let workspaceNode = AppUtils.getWorkspaceNode();
  }

  render() {
    const { dispatch, user, contentLoading, course_list } = this.props;

    const lessons_view = (course) => {
      if (course.lessons.length > 0) {
        return course.lessons.map((_lesson, index) => {
          return (
            <li className={`list-group-item lesson-item`} key={`lesson-${index}`}>
              <div className={`lesson-num-status-indicator ${(_lesson.published ? 'published' : 'unpublished')}`}>{(index+1)}</div>
              <Link to={`/admin/lesson/${_lesson.id}`} className='btn lesson-link'>
                  {_lesson.title} ({(_lesson.published ? "Published" : "Unpublished")})
              </Link>
              <a className="delete-button" onClick={e => this.handleDeleteLessonClick(e, _lesson, course.id)}><i className="fa fa-times" aria-hidden="true"></i></a>
              {/*<a className="edit-lesson-button" onClick={e => this.handleEditLessonClick(e, _lesson)}><i className="fa fa-pencil" aria-hidden="true"></i></a>*/}
              <div className="clearfix"></div>
            </li>
          );
        });
      } else {
        return (
          <p className="no-lessons">There aren't any lessons in the course yet.</p>
        )
      }
    }

    const courses_view = () => {
      return course_list.map((_course, index) => {
        return (
          <div className="panel panel-default overview-panel"  key={`course-${index}`}>
            <div className="panel-heading" role="tab" id={`course${_course.id}`}>
              <div className="index-indicator">{index + 1}</div>
              <h4 className="panel-title course-name">
                <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#course_accordion_${_course.id}`} aria-expanded="true" aria-controls={`course_accordion_${_course.id}`}>
                  {_course.name} ({_course.lessons.length})
                </a>
              </h4>
              <a className="delete-button" onClick={e => this.handleDeleteCourseClick(e, _course)}><i className="fa fa-times" aria-hidden="true"></i></a>
              <a role="button" className="edit-button" onClick={e => this.handleEditCourseClick(e, _course)}><i className="fa fa-pencil" aria-hidden="true"></i> EDIT</a>
              <div className="clearfix"></div>
            </div>
            <div id={`course_accordion_${_course.id}`} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
              <div className="panel-body">
                <ul className="list-group">
                  {lessons_view(_course)}
                </ul>
                <button className="orange-button btn pull-right inner-add-lesson-btn" onClick={e => this.handleAddLessonClick(e, _course)}>ADD LESSON <i className="fa fa-plus" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="course-overview">
        <div className="col-md-12">
          <h3 className="heading pull-left">Dashboard</h3>
        </div>
        <button className="orange-button btn pull-right" onClick={e => this.handleAddCourseClick(e)}>ADD COURSE <i className="fa fa-plus" aria-hidden="true"></i></button>
        <div className="clearfix"></div>
        <div>
          {courses_view()}
        </div>
      </div>
    );
  }

  handleAddCourseClick(e) {
    e.preventDefault();
    $( ".admin-container" ).addClass( "toggled" );
    const { dispatch, state } = this.props;
    dispatch(AdminActions.addCourse());
  }

  handleEditCourseClick(e,course) {
    e.preventDefault();
    $( ".admin-container" ).addClass( "toggled" );
    const { dispatch, state } = this.props;
    dispatch(AdminActions.editCourse(course));
  }

  handleDeleteCourseClick(e, course) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    var r = confirm(`Are you sure you wish to delete the ${course.name} course? All associated lesson data will be deleted as well.`);
    if (r == true) {
      dispatch(AdminActions.deleteCourse(course.id));
    }
  }

  handleLessonClick(lesson_id) {
    const { dispatch, state } = this.props;
    dispatch(AdminActions.getLessonData(lesson_id));
  }
  handleEditLessonClick(e, lesson) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(AdminActions.editLesson(lesson));
  }

  handleAddLessonClick(e, course) {
    e.preventDefault();
    $( ".admin-container" ).addClass( "toggled" );
    const { dispatch, state } = this.props;
    dispatch(AdminActions.addLesson(course));
  }

  handleDeleteLessonClick(e, lesson, course_id) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    var r = confirm(`Are you sure you wish to delete ${lesson.title}? All associated page data will be deleted as well.`);
    if (r == true) {
      dispatch(AdminActions.deleteLesson(lesson.id, course_id));
    }
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(CourseOverview);
