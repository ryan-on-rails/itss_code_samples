import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class CompositionActivity extends React.Component {
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
      let questions_view = activity.questions.map((question, index) => {
        return(
          <div className="form-group clearfix" key={`composition-question-${question.id}`}>
            <div className="col-md-11">
              <label htmlFor="content">Question</label>
              <input type="text" className="form-control"
                name="content"
                placeholder="Question"
                onChange={(e) => this.handleQuestionTextChange(e,index)}
                value={question.content || ""} />
            </div>
            <button className="btn delete-button col-md-1"
              data-toggle="tooltip" data-placement="right" title="Remove Question"
              onClick={(e) => this.handleRemoveQuestionClick(e, index)} >
              <span>
                <i className="fa fa-times"></i>
              </span>
            </button>
            <div className="col-md-4">
              <label htmlFor="main_idea_words_string">Main Idea Answer Words(comma seperated words)</label>
              <textarea className="form-control"
                name="main_idea_words_string"
                rows="1"
                placeholder="Main Idea Answer Words"
                onChange={(e) => this.handleQuestionTextChange(e, index)}
                value={question.main_idea_words_string || ""} ></textarea>
            </div>
            <div className="col-md-4">
              <label htmlFor="signaling_words_string">Signaling Answer Words(comma seperated words)</label>
              <textarea className="form-control"
                name="signaling_words_string"
                rows="1"
                placeholder="Signaling Answer Words"
                onChange={(e) => this.handleQuestionTextChange(e, index)}
                value={question.signaling_words_string || ""} ></textarea>
            </div>
            <div className="col-md-4">
              <label htmlFor="detail_words_string">Detail Answer Words(comma seperated words)</label>
              <textarea className="form-control"
                name="detail_words_string"
                rows="1"
                placeholder="Answer"
                onChange={(e) => this.handleQuestionTextChange(e, index)}
                value={question.detail_words_string || ""} ></textarea>
            </div>
          </div>
        );
      });
      return (
        <div className="composition-activity-edit clearfix">
          <h3 className="activity-label">Composition Activity</h3>
          <a className="delete-button" onClick={this.props.onDeleteActivityClick}><i className="fa fa-times" aria-hidden="true"></i></a>
          <Monologues activity_object={this.state.activity}/>
          <div className="form-group col-md-12">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" className="form-control"
              name="instructions"
              id="instructions"
              placeholder="Instructions"
              onChange={(e) => this.handleInstructionsEdit(e)}
              value={this.state.activity.instructions || ""} />
          </div>
          {questions_view}
          <button className="btn pull-right add-question" onClick={(e) => this.handleAddQuestionClick(e)} data-toggle="tooltip" data-placement="right" title="Add Question">
            <i className="fa fa-plus"></i>
          </button>
        </div>
      );
    }

  handleInstructionsEdit(e) {
    let activity = this.state.activity;
    activity.instructions = e.target.value;
    this.setState({ activity: activity });
  }
  handleQuestionTextChange(e, index) {
    let activity = this.state.activity;
    activity.questions[index][e.target.name] = e.target.value;
    this.setState({ activity: activity });
  }
  handleAddQuestionClick(e){
    e.preventDefault();
    let activity = this.state.activity;
    activity.questions.push({content: "", words_string: ""});
    this.setState({ activity: activity });
  }
  handleRemoveQuestionClick(e,index){
    e.preventDefault();
    let activity = this.state.activity;
    activity.questions.slice(index,1);
    this.setState({ activity: activity });
  }
  handleDeleteActivityClick(e) {
    const { dispatch } = this.props;
    let activity = this.state.activity;
    var r = confirm("Are you sure you want to delete this activity?");
    if(r===true){
      //dispatch(AdminActions.removeActivity(activity.id));
    }
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(CompositionActivity);
