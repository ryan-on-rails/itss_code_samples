 import React                 from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Alert, Modal, Button, FieldGroup }    from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import LessonAttachment       from './LessonAttachment';

class LessonAttachments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {lesson: {lesson_attachments: []}, showLessonAttachments: false, showAddButton: true};
  }

  componentDidMount() {
  }

  componentWillMount() {
    
    this.setState({ lesson: this.props.lesson_object});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ lesson: this.props.lesson_object});
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let lesson = this.state.lesson;

    let lesson_attachments = (lesson) => {
      let attachments = typeof lesson.lesson_attachments != "undefined" ? lesson.lesson_attachments : [];
      return attachments.map((lesson_attachment, index)=>{
        return(
          <LessonAttachment lesson_attachment={lesson_attachment} index={index} key={`lesson_attachment-${index}-${lesson_attachment.id}`}/>
        );
      });
    };

    return(
      <div className="edit-lesson_attachments-container">
        <a className="lesson_attachments-button pull-right" onClick={e => this.handleShowLessonAttachmentsClick(e)} data-toggle="tooltip" data-placement="right" title="Preview Audio">
          <i className="fa fa-paperclip" aria-hidden="true"></i>
        </a>
        <Modal show={this.state.showLessonAttachments} className="edit-lesson_attachments" onHide={() => this.handleDismissLessonAttachmentsClick()} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>Lesson Attachments</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {lesson_attachments(lesson)}

            <div className="form-group col-md-6">
              <label>Add a new attachment?</label>
              <input
                  id="formControlsFile"
                  type="file"
                  label="File"
                  help="Upload a new File"
                  onChange={e => this.handleAddLessonAttachmentsClick(e)}
                />
            </div>
            <div className="clearfix"></div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.handleDismissLessonAttachmentsClick()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  handleAddLessonAttachmentsClick(e) {
    const { dispatch } = this.props;
    let lesson = this.state.lesson;
    dispatch(AdminActions.saveLessonAttachment(e.target.files[0], lesson));

  }

  handleShowLessonAttachmentsClick(e) {
    this.setState({showLessonAttachments: true});
  }
  handleDismissLessonAttachmentsClick() {
    this.setState({showLessonAttachments: false});
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(LessonAttachments);
