import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class FindAndClickActivity extends React.Component {
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
      
      return (
        <div className="qa-activity-edit clearfix">
          <h3 className="activity-label">Find and Click Activity</h3>
          <a className="delete-button" onClick={this.props.onDeleteActivityClick}><i className="fa fa-times" aria-hidden="true"></i></a>
          <Monologues activity_object={this.state.activity}/>
          <div className="form-group col-md-12">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" className="form-control"
              name="instructions"
              id="instructions"
              placeholder="Instructions"
              onChange={(e) => this.handleInstructionsEdit(e)}
              value={activity.instructions || ""} />
          </div>
          <div className="form-group clearfix">
            <div className="col-md-6">
              <label htmlFor="content">Question</label>
              <input type="text" className="form-control"
                name="content"
                placeholder="Question"
                onChange={(e) => this.handleQuestionTextChange(e)}
                value={activity.question.content || ""} />
            </div>
            <div className="col-md-6">
              <label htmlFor="words_string">Answer Words(comma seperated words)</label>
              <input type="textarea" className="form-control"
                name="words_string"
                placeholder="Answer Words"
                onChange={(e) => this.handleQuestionTextChange(e)}
                value={activity.question.words_string || ""} />
            </div>
          </div>
        </div>
      );
    }

  handleInstructionsEdit(e) {
    let activity = this.state.activity;
    activity.instructions = e.target.value;
    this.setState({ activity: activity });
  }
  handleQuestionTextChange(e) {
    let activity = this.state.activity;
    activity.question[e.target.name] = e.target.value;
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

export default connect(select)(FindAndClickActivity);
