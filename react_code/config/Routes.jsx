import React                    from 'react'
import { Router,
         Route,
         IndexRoute,
         hashHistory}           from 'react-router'
import { connect }              from 'react-redux'
import Main                     from '../components/Main'
import App                      from '../components/App'
import TeacherDashboard         from '../components/TeacherDashboard'
import AdminDashboard           from '../components/AdminDashboard'
import ClassroomStatusContainer from '../containers/ClassroomStatusContainer'
import ResourcesContainer       from '../containers/ResourcesContainer'
import ReportsContainer         from '../containers/ReportsContainer'
import ReportContainer          from '../containers/ReportContainer'
import * as AdminComponents     from '../components/admin_components';
import LoginRosterContainer     from '../containers/LoginRosterContainer'

/* Routes
 *
 * The routes divide the application into three separate interfaces.
 *
 *   1. Student - the tutoring App
 *   2. Teacher - dashboard for monitoring student responses and lesson
 *                materials
 *   3. Admin   - panel for authoring lessons and activities
 */
class Routes extends React.Component {
  constructor(props) {
    super(props)

    this.loginRedirect      = this.loginRedirect.bind(this)
    this.requireAdminAuth   = this.requireAdminAuth.bind(this)
    this.requireTeacherAuth = this.requireTeacherAuth.bind(this)
  }

 /* loginRedirect
  *
  * pulls in a one-time redirect from the server page that redirects
  * the user to their appropriate interface (this is based on the user
  * application_root)
  */
  loginRedirect(location, replace) {
    if (REDIRECT && REDIRECT !== '/') {
      replace(REDIRECT)

      // set to false so that admins or teachers can still visit the
      // student app via Link
      REDIRECT = false
    }
  }

 /* requireAdminAuth
  *
  * redirects the user to their previous location if they are not an
  * admin.
  */
  requireAdminAuth(location, replaceState) {
    if (!(this.props.admin)) {
      replaceState({ unauthorized: true }, location)
    }
  }

 /* requireTeacherAuth
  *
  * redirects the user to their previous location if they are not a
  * teacher. Admins have special priority.
  */
  requireTeacherAuth(location, replaceState) {
    if (!(this.props.admin || this.props.teacher)) {
      replaceState({ unauthorized: true }, location)
    }
  }

  render() {
    // const { dispatch, activity, page, user, lesson, panels, feedback, progress, contentLoading } = this.props;
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Main} onEnter={this.loginRedirect}>
          {/* Student interface */}
          <IndexRoute component={App} />

          {/* Teacher interface */}
          <Route path='dashboard'
            component={TeacherDashboard}
            onEnter={this.requireTeacherAuth}>

            <IndexRoute
              component={ClassroomStatusContainer} />
            <Route path='classroom-status'
              component={ClassroomStatusContainer} />
            <Route path='resources'
              component={ResourcesContainer} />
            <Route path='login-roster'
              component={LoginRosterContainer} />
            <Route path='reports'
              component={ReportsContainer}>
              <Route path=':reportType'
                component={ReportContainer} />
            </Route>
          </Route>

          {/* Admin interface   */}
          <Route path='admin'
            component={AdminDashboard}
            onEnter={this.requireAdminAuth} >
            <IndexRoute
              component={AdminComponents.CourseOverview} />
            <Route path='lesson/:lesson_id'
                component={AdminComponents.LessonOverview} />
            <Route path='activity_overview/:page_id'
                component={AdminComponents.ActivityOverview} />
            <Route path='articles'
                component={AdminComponents.ArticleOverview} />
            <Route path='article/edit/:article_id'
                component={AdminComponents.ArticleEdit} />
            <Route path='article/new'
                component={AdminComponents.ArticleEdit} />
          </Route>
          <Route path='admin/lesson/:lesson_id'
            component={AdminDashboard}
            onEnter={this.requireAdminAuth} >
            <IndexRoute
              component={AdminComponents.LessonOverview} />
            <Route path='lesson/:lesson_id'
                component={AdminComponents.LessonOverview} />
          </Route>
          <Route path='admin/article/:article_id'
            component={AdminDashboard}
            onEnter={this.requireAdminAuth} >
            <IndexRoute
              component={AdminComponents.ArticleEdit} />
            <Route path='article/:article_id'
                component={AdminComponents.ArticleEdit} />
          </Route>
        </Route>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    admin:   state.user.admin,
    teacher: state.user.teacher
  }
}

export default connect(mapStateToProps)(Routes)
