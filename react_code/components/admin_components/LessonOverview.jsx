import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import * as GlobalActions     from '../../actions/GlobalActions';
import Page                   from './Page';
import { Link }               from 'react-router'


class LessonOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {  };
  }

  componentWillMount() {
    this.setState({ lesson: this.props.admin.lesson});
    // const { dispatch } = this.props;
    // let lesson_id = this.props.routeParams.lesson_id;
    // dispatch(AdminActions.getLessonData(lesson_id));
  }
  componentDidMount() {
    const { dispatch } = this.props;
    let lesson_id = this.props.routeParams.lesson_id;
    dispatch(AdminActions.getLessonData(lesson_id));
    //this.forceUpdate();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ lesson: nextProps.admin.lesson, articleType: ""});
  }

  render() {
    const { dispatch, user, contentLoading, admin } = this.props;
    let lesson = this.state.lesson;
    let lesson_view = (lesson) => {
      if (lesson.pages && lesson.pages.length > 0) {
        return lesson.pages.map((page, index) => {
          return (
            <Page page_object={page} key={`page-${index}`} index={index}/>
          );
        });
      } else {
        return (
          <p className="no-lessons">There aren't any pages in this lesson yet.</p>
        )
      }
    };

    return (
      <div className="lesson-overview">
        <div className="col-md-12">
          <Link to={`/admin`}className="breadcrumb-link pull-left"><h3 className="heading">Dashboard</h3></Link>
          <span className="breadcrumb-arrow pull-left"><i className="fa fa-chevron-right"></i></span>
          <h3 className="heading pull-left">{lesson.title}</h3>
        </div>
        <button className="orange-button btn pull-right" onClick={e => this.handleAddPageClick(e, lesson)}>ADD PAGE +</button>
        <div className="clearfix"></div>
        {lesson_view(lesson)}
      </div>
    );
  }

  handleAddPageClick(e, lesson) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    dispatch(AdminActions.addPage(lesson));
  }

  handleDeletePageClick(e, page) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    var r = confirm(`Are you sure you wish to delete this page? All activity data will be deleted as well.`);
    if (r == true) {
      dispatch(AdminActions.deletePage(page.id));
    }
  }

  activityTypeFormat(type) {
    let typeWordArray = type.split(/(?=[A-Z])/);
    typeWordArray.pop();
    return typeWordArray.join(" ");
  }

  pageTitle(page) {
    return page.activities.map((activity, index) => {
      return (
        <div>
          {activity.instructions} ({this.activityTypeFormat(activity.type)})
        </div>
      );
    });
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(LessonOverview);
