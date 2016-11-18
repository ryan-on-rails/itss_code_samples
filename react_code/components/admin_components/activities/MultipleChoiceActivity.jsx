import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal, OverlayTrigger, Popover, Col }   from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class MultipleChoiceActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activity: {}};
  }

  componentDidMount() {
    let page_id = this.props.page_id;
  }

  componentWillMount() {
    this.setState({ activity: this.props.activity_object, lesson: this.props.admin.lesson});
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ activity: nextProps.activity_object, lesson: nextProps.admin.lesson});
  }

  render() {
      const { dispatch, user, contentLoading, page_id, admin } = this.props;
      let activity = this.state.activity;
      let optionCountDropdown = (activity) => {
        return (
          <div className="form-group">
            <label htmlFor="articleType">Change Question Option Count</label>
            <select className="form-control"
              name="articleType"
              id="articleType"
              onChange={(e) => this.handleChangeOptionCount(e, activity)}
              value={activity.question.options.length || ""}>
              <option value="">Select The Desired Number of Options</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Four</option>
            </select>
          </div>
        )
      };

      let optionInputs = activity.question.options.map((option, index) => {
        return (
          <Col xs={6} key={`option-${index}`} className="answer-word">
            <h5 className="center-text">Option #{index + 1}</h5>
            <div className="form-group">
              <label htmlFor="option">Answer Option</label>
              <OverlayTrigger trigger={["hover","focus"]} placement="top" overlay={<Popover id="instructions" title="Correct?">Determines if this option is an acceptable answer.</Popover>}>
                <label className="pull-right">
                  <input type="checkbox"
                    defaultChecked={option.correct || false}
                    name="correct"
                    onClick={e => this.handleToggleCheckboxClick(e, option)}/>
                      &nbsp;&nbsp;Correct?
                </label>
              </OverlayTrigger>
              <input type="text" className="form-control"
                name="option"
                id="option"
                placeholder="Fill in your option here"
                onChange={(e) => this.handleOptionEdit(e, option)}
                value={option.label || ""} />
            </div>
          </Col>
        )
      });

      return (
        <div className="multiple-choice-activity-edit clearfix">
          <h3 className="activity-label">Multiple Choice Activity</h3>
          <a className="delete-button" onClick={this.props.onDeleteActivityClick}><i className="fa fa-times" aria-hidden="true"></i></a>
          <Monologues activity_object={this.state.activity}/>
          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" className="form-control"
              name="instructions"
              id="instructions"
              placeholder="Instructions"
              onChange={(e) => this.handleInstructionsEdit(e)}
              value={activity.instructions || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="content">Question Content</label>
            <input type="text" className="form-control"
              name="content"
              id="content"
              placeholder="Content"
              onChange={(e) => this.handleContentEdit(e)}
              value={activity.question.content || ""} />
          </div>
          {optionCountDropdown(activity)}
          {optionInputs}
        </div>
      );
    }

  handleInstructionsEdit(e) {
    let activity = this.state.activity;
    activity.instructions = e.target.value;
    this.setState({ activity: activity });
  }

  handleDeleteActivityClick(e) {
    const { dispatch } = this.props;
    let activity = this.state.activity;
    let lesson = this.props.admin.lesson
    var r = confirm("Are you sure you want to delete this activity?");
    if(r===true){
      lesson.pages.forEach((page) => {
          page.activities.forEach((a, index) => {
            if (activity.id === null) {
              if (activity.created_at === a.created_at) {
                page.activities.splice(index);
              }
            } else if (activity.id === a .id) {
              page.activities.splice(index);
            }
          });
      });
      this.setState({lesson: lesson});
    }
  }

  handleChangeOptionCount(e, activity) {
    e.preventDefault();
    let newCount = e.target.value;
    let options = activity.question.options;
    let optionCount = options.length;
    if (newCount > optionCount) {
      while (optionCount < newCount) {
        var newOption = {correct: false, id: null, label: "", multiple_choice_question_id: activity.question.id, tempId: optionCount};
        options.push(newOption);
        optionCount = options.length;
      }
    } else {
      var message = "Are you sure you want to reduce the number of options? You will lose " + (optionCount - newCount) + " option(s) and will have to re-create them.";
      var c = confirm(message);
      if (c===true) {
        while (newCount < optionCount) {
          options.splice(optionCount - 1);
          optionCount = options.length;
        }
      }
    }
    this.setState({activity: activity});
  }

  handleToggleCheckboxClick(e, option) {
    let activity = this.state.activity;
    option.correct = e.target.checked;
    this.setState({ activity: activity });
  }

  handleContentEdit(e) {
    let activity = this.state.activity;
    activity.question.content = e.target.value;
    this.setState({ activity: activity });
  }

  handleOptionEdit(e, option) {
    let activity = this.state.activity;
    option.label = e.target.value;
    this.setState({ activity: activity });
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(MultipleChoiceActivity);
