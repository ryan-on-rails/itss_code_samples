 import React                 from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Alert, Modal, Button }    from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';

class Lesson_attachment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {lesson_attachment: {}};
  }

  componentDidMount() {
  }

  componentWillMount() {
    
    this.setState({ lesson_attachment: this.props.lesson_attachment});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ lesson_attachment: this.props.lesson_attachment});
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let lesson_attachment = this.state.lesson_attachment;
    let attachment_image = (attachment) => {
      var type = attachment.attachment_content_type;
      var doc_reg = new RegExp("document");
      var image_reg = new RegExp("image");
      var audio_reg = new RegExp("audio");
      var pdf_reg = new RegExp("pdf");

      if(image_reg.test(type)){
        return(<img className="attachment" src={lesson_attachment.attachment_url}/>);
      }else if(pdf_reg.test(type)){
        return(<i className="fa fa-file-pdf-o" aria-hidden="true"></i>);
      }else if(doc_reg.test(type)){
        return(<i className="fa fa-file-word-o" aria-hidden="true"></i>);
      }else if(audio_reg.test(type)){
        return(<i className="fa fa-file-audio-o" aria-hidden="true"></i>);
      }else{
        return(<i className="fa fa-file-o" aria-hidden="true"></i>);
      }
    };
    return(
      <div className="edit-lesson_attachment well form-group clearfix" >
        <div className="form-group col-md-4">
          <a href={lesson_attachment.attachment_url} className="download-link" download target='_blank'>
            <h4 className="file_name">{lesson_attachment.attachment_file_name}</h4>
          </a>
        </div>
        <div className=" col-md-6">
          <a href={lesson_attachment.attachment_url} className="col-md-12 download-link" download target='_blank'>
            {attachment_image(lesson_attachment)}
          </a>
        </div>
        <div className="form-group col-md-1 slug-container col-md-offset-1">
          <Button className="delete-button danger" onClick={e => this.handleDeleteLessonAttachmentClick(e)}><i className="fa fa-times" aria-hidden="true"></i></Button>
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }

  handleSaveLessonAttachmentClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(AdminActions.saveLessonAttachment(this.state.lesson_attachment));
  }
  handleDeleteLessonAttachmentClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    var r = confirm("Are you sure you want to delete this attachment?");
    if(r == true){
      dispatch(AdminActions.deleteLessonAttachment(this.state.lesson_attachment));
    }
  }


}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(Lesson_attachment);
