 import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import LessonAttachments      from './LessonAttachments';

class LessonEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {lesson: {id: null, title:"",lesson_attachments:[], description:"", number:1.0, structure_id:"1"}, action: "Add", course: {lessons:[]}};
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
    let course = nextProps.admin.course;
    this.setState({ course: course});

    if(nextProps.admin.lesson && nextProps.admin.lesson.id){
      this.setState({ lesson: nextProps.admin.lesson });
      this.setState({ action: "Edit"});
    } else {
      this.setState({ lesson: {id: null, title:"", description:"", number:1.0, structure_id:"1"} });
      this.setState({ action: "Add"});
    }
  }

  render() {
    const { dispatch, user, contentLoading, lesson, admin } = this.props;

    let feedbacks = admin.feedbacks.map((feedback, index) => {
      return(
        <option value={feedback.id} key={`feedback-${feedback.id}`}>{feedback.slug}</option>
        );
    });
    
    let lessons = this.props.admin.course ? this.props.admin.course.lessons.map((_lesson, index) => {
      if(_lesson.id == null || _lesson.id == lesson.id){ return "";}
      return(
        <option value={_lesson.id} key={`lesson-${_lesson.id}`}>{_lesson.title}</option>
        );
    }) : "";

    if (admin.create_new_lesson === true) {
      return (
        <div className="lesson-edit">
          <h3 className="heading">
            <a className="cancel-button" onClick={e => this.handleCancelClick(e)}><i className="fa fa-times" aria-hidden="true"></i></a>
            <LessonAttachments lesson_object={this.state.lesson}/>
            {this.state.action} Lesson Details
          </h3>
          <form className="itss-form lesson-edit-form">
            <div className="form-group col-md-12">
              <label htmlFor="lessonTitle">Title</label>
              <input type="text" className="form-control"
                name="title"
                id="lessonTitle"
                placeholder="Lesson Title"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.title || ""}/>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="lessonDescription">Description</label>
              <input type="textarea" className="form-control"
                name="description"
                id="lessonDescription"
                placeholder="Lesson Description"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.description || ""} />
            </div>
            <div className="form-group col-md-12">
              <div className="col-md-6">
                <label htmlFor="lessonStructure">Structure</label>
                <select className="form-control"
                  name="structure_id"
                  id="lessonStructure"
                  onChange={(e) => this.handleLessonEdit(e)}
                  value={this.state.lesson.structure_id || "1"}>
                    <option value="1">Comparison</option>
                    <option value="2">Problem & Solution</option>
                    <option value="3">Cause & Effect</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="lessonStructure">Position</label>
                <input type="number" className="form-control"
                  name="number"
                  min="0"
                  max="500"
                  step="0.1"
                  onChange={(e) => this.handleLessonEdit(e)}
                  value={this.state.lesson.number || 1}/>
              </div>
            </div>
            <div className="form-group col-md-12">
              <div className="col-md-6">
                <label htmlFor="default_pass_feedback_id">Default Passing Feedback</label>
                <select className="form-control"
                  name="default_pass_feedback_id"
                  id="default_pass_feedback_id"
                  onChange={(e) => this.handleLessonEdit(e)}
                  value={this.state.lesson.default_pass_feedback_id }>
                    <option >Select a Feedback</option>
                    {feedbacks}
                </select>
              </div>
              <div className="col-md-6">
              <label htmlFor="default_fail_feedback_id">Default Failure Feedback</label>
                <select className="form-control"
                  name="default_fail_feedback_id"
                  id="default_fail_feedback_id"
                  onChange={(e) => this.handleLessonEdit(e)}
                  value={this.state.lesson.default_fail_feedback_id }>
                    <option >Select a Feedback</option>
                    {feedbacks}
                </select>
              </div>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="published">Lesson Status</label>
              <select className="form-control"
                name="published"
                id="published"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.published || "true" }>
                  <option value="true">Published</option>
                  <option value="false">Unpublished</option>                  
              </select>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="default_next_lesson_id">Default Next Lesson</label>
              <select className="form-control"
                name="default_next_lesson_id"
                id="default_next_lesson_id"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.default_next_lesson_id }>
                  <option >Select a Lesson</option>
                  {lessons}
              </select>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="remedial_next_lesson_id">Remedial Next Lesson</label>
              <select className="form-control"
                name="remedial_next_lesson_id"
                id="remedial_next_lesson_id"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.remedial_next_lesson_id }>
                  <option >Select a Lesson</option>
                  {lessons}
              </select>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="advanced_next_lesson_id">Advanced Next Lesson</label>
              <select className="form-control"
                name="advanced_next_lesson_id"
                id="advanced_next_lesson_id"
                onChange={(e) => this.handleLessonEdit(e)}
                value={this.state.lesson.advanced_next_lesson_id }>
                  <option >Select a Lesson</option>
                  {lessons}
              </select>
            </div>
            <button type="button" className="btn btn-primary save-button"  onClick={e => this.handleSaveLessonClick(e)} >SAVE CHANGES <i className="fa fa-check pull-right" aria-hidden="true"></i></button>
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

  handleSaveLessonClick(e) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    $( ".admin-container" ).removeClass( "toggled" );
    // In order to edit the lesson, we have to pass only the specific params that the api is expecting
    let l = this.state.lesson
    let lesson = {
      id: l.id,
      title: l.title,
      structure_id: l.structure_id,
      number: l.number,
      description: l.description,
      published: l.published,
      default_fail_feedback_id: l.default_fail_feedback_id,
      default_pass_feedback_id: l.default_pass_feedback_id,
      default_next_lesson_id: l.default_next_lesson_id,
      remedial_next_lesson_id: l.remedial_next_lesson_id,
      advanced_next_lesson_id: l.advanced_next_lesson_id
    }
    dispatch(AdminActions.saveLesson(lesson, this.props.admin.course.id));
  }

  handleLessonEdit(e) {
    let lesson = this.state.lesson;
    lesson[e.target.name] = e.target.value;
    this.setState({ lesson: lesson });
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

export default connect(select)(LessonEdit);
