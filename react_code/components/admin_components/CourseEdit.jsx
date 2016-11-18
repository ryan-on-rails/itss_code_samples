import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';

class CourseEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {show: false, course: {id: null, name:"", description:""}, action: "Add"};
  }

  componentDidMount() {
    var elem = ReactDOM.findDOMNode(this);

    elem.style.opacity = 0;
    window.requestAnimationFrame(function() {
      elem.style.transition = "opacity 250ms";
      elem.style.opacity = 1;
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.admin.course && nextProps.admin.course.id){
      this.setState({ course: nextProps.admin.course });
      this.setState({ action: "Edit"});
    }
    else{
       this.setState({ course: {id: null, name:"", description:""} });
       this.setState({ action: "Add"});
    }
  }

  render() {
    const { dispatch, user, contentLoading, course, admin } = this.props;

    if (admin.create_new_course === true) {
      return (
        <div className="course-edit">
          <h3 className="heading">
            <a className="cancel-button" onClick={e => this.handleCancelClick(e)}><i className="fa fa-times" aria-hidden="true"></i></a>
            {this.state.action} Course Details
            </h3>
          <form className="itss-form">
            <div className="form-group">
              <label htmlFor="courseName">Name</label>
              <input type="text" className="form-control"
                name="name"
                id="courseName"
                placeholder="Course Name"
                onChange={(e) => this.handleCourseEdit(e)}
                value={this.state.course.name || ""}/>
            </div>
            <div className="form-group">
              <label htmlFor="courseDescription">Description</label>
              <input type="text" className="form-control"
                name="description"
                id="courseDescription"
                placeholder="Course Description"
                onChange={(e) => this.handleCourseEdit(e)}
                value={this.state.course.description || ""} />
            </div>
            <button type="button" className="btn btn-primary save-button"  onClick={e => this.handleSaveCourseClick(e)} >SAVE CHANGES <i className="fa fa-check pull-right" aria-hidden="true"></i></button>
          </form>
        </div>
      );
    }
    else {
      return (
        <div></div>
        );
    }
  }

  handleSaveCourseClick(e) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    $( ".admin-container" ).removeClass( "toggled" );
    dispatch(AdminActions.saveCourse(this.state.course));
    // dispatch(ActivityActions.submitResponse(response, state));
  }

  handleCourseEdit(e) {
    let course = this.state.course;
    course[e.target.name] = e.target.value;
    this.setState({ course: course });
  }

  handleSubmit() {
    const { response } = this.state;

    if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please provide an answer in each field.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }

  handleCancelClick(e) {
    e.preventDefault();
    $( ".admin-container" ).removeClass( "toggled" );
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(CourseEdit);
