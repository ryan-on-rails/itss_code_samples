import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import * as GlobalActions     from '../../actions/GlobalActions';

class ActivityOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {  };
  }

  componentWillMount() {
    //this.setState({ page_id: this.props.admin.page_id});
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(GlobalActions.setLoading());
    let page_id = this.props.routeParams.page_id;
    //dispatch(AdminActions.getLessonData(lesson_id));
    dispatch(GlobalActions.clearLoading());
    this.forceUpdate();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ lesson: nextProps.admin.lesson});
  }

  render() {
    const { dispatch, user, contentLoading, admin } = this.props;


    return (
      <div className="activity-overview">
        <div className="clearfix"></div>
        <div>
          
        </div>
      </div>
    );
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(ActivityOverview);
