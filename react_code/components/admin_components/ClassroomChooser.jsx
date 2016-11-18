import React, { PropTypes }   from 'react';
import { Router,Link }        from 'react-router'
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import * as GlobalActions     from '../../actions/GlobalActions';
import * as ContentElements   from './content_elements';
import * as Activities        from './activities';

class ClassroomChooser extends React.Component {
  constructor(props) {
    super(props);

    this.state = { school: {} };
  }

  componentDidMount() {
    this.setState({ });
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.school.id != null && typeof this.state.school.classrooms == "undefined"){
      let school = {};
      let index = nextProps.admin.schools.findIndex((_school)=>{
        return _school.id == this.state.school.id;
      });
      if(index >= 0){school = nextProps.admin.schools[index];}
      if(school.id == this.state.school.id){ this.setState({ school: school }); }      
    }
  }

  render() {
    if(!this.props.user.admin){
      return(<div/>);
    }
    const { dispatch } = this.props;
    let current_school = this.state.school;

    let classrooms = (this.state.school.id == null || typeof this.state.school.classrooms === "undefined") ? [] : this.state.school.classrooms;
    let classrooms_view = classrooms.map((classroom)=>{
      return(
        <option value={classroom.id} key={`classroom-${classroom.id}`}>{classroom.name}</option>
      );
    });
    let schools_view = this.props.admin.schools.map((school)=>{
      return(
        <option value={school.id} key={`school-${school.id}`}>{school.name}</option>
      );
    });
    let dashboard_link = "";
    let admin_link = "";

    if(this.props.user.classroom_id != null && window.location.toString().indexOf('admin') > -1 ){
      dashboard_link = (<div className='form-group col-md-4 pull-right'><Link to={`/dashboard`} type='button' className='btn teacher-dash overview-md'>Teacher Dashboard</Link></div>);
    }
    if (window.location.toString().indexOf('dashboard') > -1){
      admin_link = (<div className='form-group col-md-4 pull-right'><Link to={`/admin`} type='button' className='btn admin-dash'>Admin Dashboard</Link></div>);
    }

    return (
      <div className="classroom-chooser">
        {dashboard_link}
        {admin_link}
        <div className="form-group col-md-4 pull-right">
          <select className="form-control"
            name="classroom"
            id="classroom"
            onChange={(e) => this.handleClassroomChange(e)}
            value="">
            <option >Choose a classroom</option>
            {classrooms_view}
          </select>
        </div>
        <div className="form-group col-md-4 pull-right">
          <select className="form-control"
            name="school"
            id="school"
            onChange={(e) => this.handleSchoolChange(e)}
            value={current_school.id || ""}>
            <option >Choose a School</option>
            {schools_view}
          </select>
        </div>
      </div>
    );
  }
  handleSchoolChange(e) {
    const { dispatch } = this.props;
    let school = {};
    let index = this.props.admin.schools.findIndex((_school)=>{
      return _school.id.toString() === e.target.value.toString();
    })
    if(index >= 0 ){school = this.props.admin.schools[index];}
    if(typeof school.classrooms == "undefined"){
      dispatch(AdminActions.getClassroomsForSchool(school.id));
    }
    this.setState({ school: school });
  }

  handleClassroomChange(e) {
    const { dispatch } = this.props;
    if(this.props.user.classroom_id != e.target.value){
      dispatch(AdminActions.setClassroom(e.target.value, this.props.user.id));
    }
    // window.location.replace("/#/dashboard");
  }


  

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(ClassroomChooser);
