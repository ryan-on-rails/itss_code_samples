 import React                 from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Alert, Modal, Button }    from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import Monologue              from './Monologue';

class Monologues extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activity: {}, showMonologues: false, showAddButton: true};
  }

  componentDidMount() {
  }

  componentWillMount() {
    
    this.setState({ activity: this.props.activity_object});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ activity: this.props.activity_object});
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let activity = this.state.activity;
    if(activity.id == null){return(<div/>);}
    let monologues = (activity) => {

      return activity.monologues.map((monologue, index)=>{
        return(
          <Monologue monologue={monologue} index={index} key={`monologue-${index}-${monologue.id}`}/>
        );
      });
    };
    let add_button = ()=>{
      if(this.state.showAddButton){
        return(<Button className="add-monologue" onClick={() => this.handleAddMonologuesClick()}>Add</Button>);
      }else{
        return(<div/>);
      }
    }

    return(
      <div className="edit-monologues-container">
        <a className="monologues-button" onClick={e => this.handleShowMonologuesClick(e)} data-toggle="tooltip" data-placement="right" title="Preview Audio">
          <i className="fa fa-volume-up" aria-hidden="true"></i>
        </a>
        <Modal show={this.state.showMonologues} className="edit-monologues" onHide={() => this.handleDismissMonologuesClick()} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>Audio Entries</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {monologues(activity)}
          </Modal.Body>

          <Modal.Footer>
            {add_button()}
            <Button onClick={() => this.handleDismissMonologuesClick()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  handleAddMonologuesClick() {
    let activity = this.state.activity;
    activity.monologues.push({activity_id: activity.id, slug: "", en_text: "", en_audio_text: "", position: (activity.monologues.length+1)});
    this.setState({activity: activity});
  }

  handleShowMonologuesClick(e) {
    this.setState({showMonologues: true});
  }
  handleDismissMonologuesClick() {
    this.setState({showMonologues: false});
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(Monologues);
