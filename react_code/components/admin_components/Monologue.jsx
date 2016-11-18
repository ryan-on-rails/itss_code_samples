 import React                 from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Button, OverlayTrigger, Popover }    from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';

class Monologue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {monologue: {}, audio: null,  is_playing: false};
  }

  componentDidMount() {
  }

  componentWillMount() {
    
    this.setState({ monologue: this.props.monologue});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ monologue: this.props.monologue});
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let monologue = this.state.monologue;
    //var preview_class = this.state.is_playing === true ? 'fa-stop-circle-o' : 'fa-play-circle-o';
    var preview_class = 'fa-play-circle-o';
    let en_audio_popover = (
      <Popover id="en-audio-popover" className={`en-audio-popover`}>
        <span>Play the English Audio</span>
      </Popover>
    );
    let es_audio_popover = (
      <Popover id="en-audio-popover" className={`en-audio-popover`}>
        <span>Play the Spanish Audio</span>
      </Popover>
    );
    let text_popover = (
      <Popover id="en-audio-popover" className={`en-audio-popover`}>
        <span>Readable version of text to be read.</span>
      </Popover>
    );
    let audio_text_popover = (
      <Popover id="en-audio-popover" className={`en-audio-popover`}>
        <span>Version of text edited for pronunciation.</span>
      </Popover>
    );
    
    return(
       <div className="edit-monologue well form-group clearfix" >
        <h3 className="col-md-2">Audio {(this.props.index+1)} </h3>
        <div className="form-group col-md-3">
          <label htmlFor="slug">Name</label>
          <input type="text" className="form-control slug"
            name="slug"
            placeholder="Name"
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.slug || ""} />
        </div>
        <div className="form-group col-md-1">
          <label htmlFor="position">Position</label>
          <input type="number" className="form-control slug"
            name="position"
            step="1"
            min="0"
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.position || 0} />
        </div>
        <div className="form-group col-md-4 slug-container col-md-offset-2">
          <Button className="delete-button pull-right" onClick={e => this.handleDeleteMonologueClick(e)}><i className="fa fa-times" aria-hidden="true"></i></Button>
          <Button className="btn btn-primary pull-right save-monologue-button" onClick={(e) => this.handleSaveMonologueClick(e)}>Save</Button>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={es_audio_popover}>
            <Button className="preview-es-button btn pull-right" onClick={e => this.handleEsPreviewClick(e)}><i className={`fa ${preview_class}`} aria-hidden="true"></i></Button>
          </OverlayTrigger>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={en_audio_popover}>
            <Button className="preview-button btn pull-right" onClick={e => this.handlePreviewClick(e)}><i className={`fa ${preview_class}`} aria-hidden="true"></i></Button>
          </OverlayTrigger>
        </div>
        <div className="clearfix"></div>
        <div className="form-group col-md-6 ">
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={text_popover}>
            <label htmlFor="en_text">Text</label>
          </OverlayTrigger>
          <textarea className="form-control"
            name="en_text"
            placeholder="Text"
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.en_text || ""} />
        </div>
        <div className="form-group col-md-6">
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={audio_text_popover}>
            <label htmlFor="en_audio_text">Audio Text</label>
          </OverlayTrigger>
          <textarea className="form-control"
            name="en_audio_text"
            placeholder="This should contain updated text to help IT sound out the words correctly."
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.en_audio_text || ""} />
        </div>
        <div className="clearfix"></div>
        <div className="form-group col-md-6 ">
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={text_popover}>
            <label htmlFor="en_text">Spanish Text</label>
          </OverlayTrigger>
          <textarea className="form-control"
            name="es_text"
            placeholder="Text"
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.es_text || ""} />
        </div>
        <div className="form-group col-md-6">
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={audio_text_popover}>
            <label htmlFor="en_audio_text">Spanish Audio Text</label>
          </OverlayTrigger>
          <textarea className="form-control"
            name="es_audio_text"
            placeholder="This should contain updated text to help IT sound out the words correctly."
            onChange={(e) => this.handleTextEdit(e)}
            value={monologue.es_audio_text || ""} />
        </div>
      </div>
    )
  }

  handleSaveMonologueClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(AdminActions.saveMonologue(this.state.monologue));
  }
  handleDeleteMonologueClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    var r = confirm("Are you sure you want to delete this audio?");
    if(r === true)
    {
      dispatch(AdminActions.deleteMonologue(this.state.monologue));      
    }
  }

  handleTextEdit(e) {
    let monologue = this.state.monologue;
    monologue[e.target.name] = e.target.value;
    this.setState({ monologue: monologue });
  }

  handleAudioStop() {
    let audio = this.state.audio;
    if(audio !== null) audio.pause();
    this.setState({ audio: null, is_playing: false });      
  }
  handlePreviewClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let monologue = this.state.monologue;
    if(monologue.en_audio_path){
      if(this.state.audio !== null || this.state.is_playing === true){
        this.handleAudioStop();
      }else{
        if(this.state.audio !== null) this.state.audio.pause();
        
        let audio = document.createElement('audio');
        audio.src = monologue.en_audio_path;
        audio.preload = 'auto';
        audio.play(); 
        this.setState({ audio: audio, is_playing: true });  
      }      
    }else{
      alert("You need to save the audio first.");
    }
  }
  handleEsPreviewClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let monologue = this.state.monologue;
    if(monologue.es_audio_path){
      if(this.state.audio !== null || this.state.is_playing === true){
        this.handleAudioStop();
      }else{
        if(this.state.audio !== null) this.state.audio.pause();
        
        let audio = document.createElement('audio');
        audio.src = monologue.es_audio_path;
        audio.preload = 'auto';
        audio.play(); 
        this.setState({ audio: audio, is_playing: true });  
      }      
    }else{
      alert("You need to save the audio first.");
    }
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(Monologue);
