import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class InfoActivity extends React.Component {
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
      return (
        <div className="info-activity-edit clearfix">
          <h3 className="activity-label">Info Activity</h3>
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

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(InfoActivity);
