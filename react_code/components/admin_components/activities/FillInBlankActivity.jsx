import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal, OverlayTrigger, Popover, Col }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class FillInBlankActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activity: {}};
  }

  componentDidMount() {
    let page_id = this.props.page_id;
  }

  componentWillMount() {
    this.setState({ activity: this.props.activity_object});
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ activity: nextProps.activity_object});
  }

  render() {
      const { dispatch, user, contentLoading, page_id, admin } = this.props;
      let activity = this.state.activity;
      let columns = activity.question.fill_in_blank_fields.map((field, index) => {
        let orDisplay = (field, wordIndex) => {
          if (field.words.length > 1 && (wordIndex + 1) !== field.words.length) {
            return (<p className="word-input-separator">- OR -</p>)
          }
        };

        let wordInputs = field.words.map((word, index) => {
          let addAnswerButton = (field, index) => {
            if (index === 0) {
              return (
                <OverlayTrigger trigger={["hover","focus"]} placement="top" overlay={<Popover id="instructions" title="Add Answer">Add an additional acceptable answer to this fill in the blank field.</Popover>}>
                  <a className="add-answer-button" onClick={e => this.handleAddAnswerClick(e, field)} ><i className="fa fa-plus" aria-hidden="true" ></i></a>
                </OverlayTrigger>
              )
            }
          };

          let deleteAnswerButton = (field, word, index) => {
            if (index !== 0) {
              return (
                <OverlayTrigger trigger={["hover","focus"]} placement="top" overlay={<Popover id="instructions" title="Delete Answer">Remove this answer from the fill in the blank field.</Popover>}>
                  <a className="delete-button smaller" onClick={e => this.handleDeleteAnswerClick(e, word, field)}><i className="fa fa-times" aria-hidden="true"></i></a>
                </OverlayTrigger>
              )
            }
          };

          return (
            <div className="form-group" key={`word-${index}`}>
              <label htmlFor="answer">Answer Word</label>
              {addAnswerButton(field, index)}
              {deleteAnswerButton(field, word, index)}
              <input type="text" className="form-control"
                name="answer"
                id="answer"
                placeholder="Answer"
                onChange={(e) => this.handleFillInBlankAnswerEdit(e, word)}
                value={word.content || ""} />
              {orDisplay(field, index)}
            </div>
          )
        });

        return (
          <Col xs={this.setColumnNumber(activity.question.fill_in_blank_fields.length)} key={`field-${index}`} className="answer-word">
            <h5 className="center-text">Field @({field.position})</h5>
            {wordInputs}
          </Col>
        );
      });

      return (
        <div className="fill-in-blank-activity-edit clearfix">
          <h3 className="activity-label">Fill In The Blank Activity</h3>
          <a className="delete-button" onClick={this.props.onDeleteActivityClick}><i className="fa fa-times" aria-hidden="true"></i></a>
          <Monologues activity_object={this.state.activity}/>
          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" className="form-control"
              name="instructions"
              id="instructions"
              placeholder="Instructions"
              onChange={(e) => this.handleInstructionsEdit(e)}
              value={this.state.activity.instructions || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <OverlayTrigger trigger={["hover","focus"]} placement="right" overlay={<Popover id="instructions" title="Instructions">Format your question content with an @ symbol followed by the fill in the blank field number in parentheses. For example:<br/>
            'Compare @(1), @(2), and @(3)'</Popover>}>
              <i className="fa fa-info-circle" aria-hidden="true"></i>
            </OverlayTrigger>
            <input type="text" className="form-control"
              name="content"
              id="content"
              placeholder="Content"
              onChange={(e) => this.handleContentEdit(e)}
              value={this.state.activity.question.content || ""} />
          </div>
          <div>
            <button type="button" className="btn btn-primary add-field-button"  onClick={e => this.handleAddFieldClick(e, activity.question)} >ADD FIELD <i className="fa fa-plus pull-right" aria-hidden="true"></i></button>
          </div>
          {columns}
        </div>
      );
    }

  handleInstructionsEdit(e) {
    let activity = this.state.activity;
    activity.instructions = e.target.value;
    this.setState({ activity: activity });
  }

  handleContentEdit(e) {
    let activity = this.state.activity;
    activity.question.content = e.target.value;
    this.setState({ activity: activity });
  }

  handleSubmit() {
    const { response } = this.state;

    if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please provide the text you wish to show the student.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }

  handleAddFieldClick(e) {
    e.preventDefault();
    let activity = this.state.activity;
    var position = 1;
    if (activity.question.fill_in_blank_fields.length >= 1) {
      position = activity.question.fill_in_blank_fields.length + 1;
    }

    var newField = {
      id: null,
      question_id: activity.question.id,
      position: position,
      words: [{id: null, content: "Fill in your answer", created_at: Date.now()}]
    }
    if (activity.question.fill_in_blank_fields.length <= 5) {
      activity.question.fill_in_blank_fields.push(newField);
      this.setState({activity: activity});
    } else {
      alert("You can only add up to six fill in the blank fields.")
    }
  }

  handleAddAnswerClick(e, field) {
    e.preventDefault();
    let activity = this.state.activity;
    var newWord = {
      id: null,
      content: "Fill in your answer",
      created_at: Date.now()
    }
    if (field.words.length <= 2) {
      field.words.push(newWord)
      this.setState({activity: activity});
    } else {
      alert("You can only have three possible answers.")
    }
  }

  handleDeleteAnswerClick(e, word, field) {
    e.preventDefault();
    let activity = this.state.activity;
    field.words.forEach((w, index) => {
      if (word.id === null) {
        if (w.created_at === word.created_at) {
          field.words.splice(index);
        }
      } else if (word.id == w.id) {
        field.words.splice(index);
      }
    });
    this.setState({activity: activity});
  }

  handleFillInBlankAnswerEdit(e, word) {
    e.preventDefault();
    let activity = this.state.activity;
    word.content = e.target.value;
    this.setState({activity: activity});
  }

  setColumnNumber(fieldCount) {
    switch(fieldCount) {
      case 1:
        return 12;
      case 2:
        return 6;
      case 3:
        return 4;
      default:
        return 3;
    }
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(FillInBlankActivity);
