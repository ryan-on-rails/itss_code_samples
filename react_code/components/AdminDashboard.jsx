import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import { Link }            from 'react-router';
import * as AdminActions      from '../actions/AdminActions';
import AdminSecondaryNavBar   from './admin/AdminSecondaryNavBar';
import CourseOverview         from './admin_components/CourseOverview';
import CourseEdit             from './admin_components/CourseEdit';
import LessonEdit             from './admin_components/LessonEdit';
import ClassroomChooser       from './admin_components/ClassroomChooser';
import LoadingOverlay         from './LoadingOverlay';

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {    };
  }

  componentDidMount() {
    //let workspaceNode = AppUtils.getWorkspaceNode();
  }

  getLocationDisplay() {
    if (window.location.toString().indexOf('lesson') > -1) {
      return (
        <div className="admin-secondary-nav-bar">
          <h3 className="admin-location">
            <Link to={`/admin`} type='button' className='back-arrow'>
                <i className="fa fa-arrow-left" aria-hidden="true" />
            </Link>
            Lesson Overview
          </h3>
          <Link to={`/admin/articles`} type='button' className='orange-button btn pull-right header-btn overview-md'>
              <i className="fa fa-file-text-o" aria-hidden="true" /> Edit Articles
          </Link>
          <button className="orange-button btn pull-right header-btn edit-lesson" onClick={e => this.handleEditLessonClick(e)}>
            <i className="fa fa-pencil" aria-hidden="true"/> Edit Lesson
          </button>
          <ClassroomChooser/>
        </div>
      );
    } else if (window.location.toString().indexOf('articles') > -1){
      return (
        <div className="admin-secondary-nav-bar">
          <h3 className="admin-location">
            <Link to={`/admin`} type='button' className='back-arrow'>
                <i className="fa fa-arrow-left" aria-hidden="true" />
            </Link>
            Course Overview
          </h3>

          <Link to={`/admin`} type='button' className='orange-button btn pull-right header-btn overview-md'>
            Course Overview
          </Link>
          <ClassroomChooser/>
        </div>
      );
    } else if (window.location.toString().indexOf('article') > -1){
      return (
        <div className="">          
        </div>
      );
    } else {
      return (
        <div className="admin-secondary-nav-bar">
          <h3 className="admin-location">Course Overview</h3>
          <Link to={`/admin/articles`} type='button' className='orange-button btn pull-right header-btn overview-md'>
              <i className="fa fa-file-text-o" aria-hidden="true" /> Edit Articles
          </Link>
          <ClassroomChooser/>
        </div>
      );
    }
  }

  render() {
    const { dispatch, user, contentLoading, course } = this.props;


    let alertUI = () => {
      if(this.props.admin.alertVisible) {
        return (
          <Modal.Dialog bsStyle="warning" backdrop="true" onDismiss={() => this.handleAlertDismiss()}>
            <Modal.Header closeButton={true} onHide={() => this.handleAlertDismiss()}>
              <Modal.Title>Oops..</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {this.props.admin.alertMessage}
            </Modal.Body>

            <Modal.Footer>
              <button className="btn btn-default" onClick={() => this.handleAlertDismiss()}>Close</button>
            </Modal.Footer>

          </Modal.Dialog>
        );
      }
    };
    return (
      <div className="admin-container">
        {this.getLocationDisplay()}
        <div className="admin-container-left">
          {/*<h3 className="heading">My Dashboard</h3>*/}
          <div className="admin-dashboard">
            {this.props.children}
          </div>
        </div>
        <div className="admin-container-right">
          <CourseEdit />
          <LessonEdit />
        </div>
        {alertUI()}
        <LoadingOverlay loading={contentLoading}>
          <span>Loading Lesson Content...</span>
        </LoadingOverlay>
      </div>
    );
  }

  handleAlertDismiss() {
    this.props.dispatch(AdminActions.hideAlert());
  }
  handleEditLessonClick(e) {
    e.preventDefault();
    $( ".admin-container" ).addClass( "toggled" );
    let lesson = this.props.admin.lesson;
    const { dispatch, state } = this.props;
    dispatch(AdminActions.editLesson(lesson));
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}


export default connect(select)(AdminDashboard);
