import React, { PropTypes }    from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import CommonAbbreviation     from './CommonAbbreviation';

class SentenceSynonyms extends React.Component {  
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {content: null, show_image_modal: false, show_textarea: false, show_word_traslate: false, 
      show_simple_sentence: false, sentence_count: 0, 
      target_sentence: {id: null, sentence: "",sentence_synonyms: [{sentence: "", delete_image: false}]}};
  }

  componentDidMount() {
    var sentence_count = 0;
    this.props.paragraph_collection.forEach((paragraph, i) => {
      paragraph.sentences = paragraph.sentences.map((sentence, index) => {
        sentence_count += 1;
        sentence.sentence_index = sentence_count;
        return sentence;
      });
    });
    this.setState({ sentence_count: sentence_count });
    jQuery("."+this.props.slug+" .sentence").first().click();
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    var sentence_count = 0;
    var target_sentence = this.state.target_sentence;
    nextProps.paragraph_collection.forEach((paragraph, i) => {
      if(typeof paragraph.sentences == "undefined" || paragraph.sentences == null){paragraph.sentences = [];}
      paragraph.sentences.forEach((sentence, index) => {
        sentence_count += 1;
        sentence.sentence_index = sentence_count;
        if(sentence.id == target_sentence.id || sentence.sentence_index == target_sentence.sentence_index){
          target_sentence = sentence;
        }
      });
    });
    this.setState({ sentence_count: sentence_count, target_sentence:target_sentence });
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let target_sentence = this.state.target_sentence;
    let symbols = [".",",","!","?",";",":","(",")","=","-"];
    let left_space_symbols = ["(","=","-"];
    
    let get_markup_word = (word, sentence, i) => {
      let class_name = "";
      if((i >= sentence.words.length-2 && symbols.indexOf(word.content) < 0) || word.is_abbv){
        return( <CommonAbbreviation word={word} sentence_id={sentence.id} key={`word-${i}-${word.id}`}/>);
      }
      if(symbols.indexOf(word.content) >= 0){
        var space = left_space_symbols.indexOf(word.content) >= 0 ? " " : "";
        return (<span key={`word-${i}-${word.id}`}>{space}{word.content}</span>);
      }
      return (<span className={`word ${class_name}`} key={`word-${i}-${word.id}`}> {word.content}</span>);
    }
    let get_markup_sentence = (sentence, i) => {
      let sentence_word_count = sentence.words.length;
      if(sentence_word_count <= 0){return;}
      let words = sentence.words.map((word, i) => { return get_markup_word(word, sentence, i); });
      return (<span onClick={e => this.handleSentencClick(e, sentence)} className={`sentence ${(sentence.id == target_sentence.id ? "active" : "")}`} key={`sentence-${i}`}>{words} </span>);
    }
    let get_markup_paragraphs = () => {
      let paragraphs = this.props.paragraph_collection;
      return paragraphs.map((paragraph, index) => {
        var sentences = paragraph.sentences.map((sentence, i) => {
            return(get_markup_sentence(sentence, i));
        }); 
        return (<p className="paragraph" key={`paragraph-${index}`}>{sentences}</p>);
      }); 
    };

    let synonym_sentence_input = () => {
      if(target_sentence && target_sentence.sentence_synonyms && target_sentence.sentence_synonyms[0]){
        return (<input className="col-md-12 synonym-input" type="text" 
              onChange={(e) => this.handleSentenceSynonymEdit(e)}
              value={(this.state.target_sentence.sentence_synonyms[0].sentence || " ")} />);
      }else{
        return (<input className="col-md-12 synonym-input" type="text" 
              onChange={(e) => this.handleSentenceSynonymEdit(e)} 
              value=" " />);
      }
    }

    let synonym_sentence_image_modal = () => {
      return(<Modal show={this.state.show_image_modal} onHide={e => this.hideImageModal(e)} dialogClassName={'synonym-sentence-image-modal'}>
          <div className="modal-close-instructions">Please click anywhere outside of this box to close this window.</div>
          <img src={((target_sentence && target_sentence.sentence_synonyms[0] && target_sentence.sentence_synonyms[0].image_is_attached) ? target_sentence.sentence_synonyms[0].image_url : "" )} />
          <label>
            <input id="formControlsFile"
              className=""
              type="file"
              label="File"
              accept=".jpg,.jpeg,.png,.gif"
              help="Upload a new File"
              onChange={e => this.handleImageChange(e)}
              />
            <span><i className="fa fa-pencil" aria-hidden="true"></i> Upload New</span>
            <span onClick={e => this.handleDeleteImage(e)} ><i className="fa fa-times" aria-hidden="true"></i> Remove </span>
          </label>
        </Modal>);
    }
    
    return(         
      <div>       
        <div className={`content`}>
          {get_markup_paragraphs()}
        </div>
        <div className="work-area">
          <div className="col-md-10">
            <label>Simplified Version</label>
            {synonym_sentence_input()}
            <div className="col-md-12">
              <span className="col-md-1 sentence-counter">{target_sentence.sentence_index || 0}/{this.state.sentence_count || 0}</span>
              <div className="col-md-2 sentence-arrows">
                <i className="fa fa-caret-left" aria-hidden="true" onClick={e => this.handleLastSentence(e)}></i>
                <i className="fa fa-caret-right" aria-hidden="true" onClick={e => this.handleNextSentence(e)}></i>
              </div>
              <div className="col-md-4 col-md-offset-5 sentence-image">
                {synonym_sentence_image_modal()}
                <button onClick={e => this.showImageModal(e)}>
                  <i className="fa fa-picture-o" aria-hidden="true"></i>  
                  <span>{((target_sentence.sentence_synonyms[0] && (target_sentence.sentence_synonyms[0].image_is_attached || target_sentence.sentence_synonyms[0].image)) ? "Change Image" : "Attach Image")} </span>              
                </button>
              </div>
            </div>
            <div className="clearfix"/>
          </div>
          <div className="col-md-2">
            <div className="edit-button-container">
              <button className="btn btn-primary btn-circle save-sentence-synonym" onClick={e => this.handleSaveSentenceSynonymClick(e)}><i className="fa fa-check" aria-hidden="true"></i></button>
            </div>
          </div>
          <div className="clearfix"/>
        </div>
      </div>
    );
  }

  hideImageModal(e){
    this.setState({ show_image_modal: false });
  }
  showImageModal(e){
    e.preventDefault();
    this.setState({ show_image_modal: true });
  }

  handleSentenceSynonymEdit(e) {
    let target_sentence = this.state.target_sentence;
    let synonym_sentence = target_sentence.sentence_synonyms[0] || {};
    synonym_sentence.sentence = e.target.value;
    target_sentence.sentence_synonyms[0] = synonym_sentence;
    this.setState({ target_sentence: target_sentence });
  }
  handleSentencClick(e, sentence) {
    jQuery("."+this.props.slug+" .sentence.active").removeClass("active");
    jQuery(e.target).addClass("active");
    if(typeof sentence.sentence_synonyms =="undefined" || sentence.sentence_synonyms.length == 0){sentence.sentence_synonyms =[{sentence: "", delete_image: false}];}
    this.setState({ target_sentence: sentence });
  }
  handleSaveSentenceSynonymClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    // In order to edit the sentence, we have to pass only the specific params that the api is expecting
    let s = this.state.target_sentence;
    let ss = s.sentence_synonyms[0] || {};
    let sentence = {
      base_sentence_id: s.id,
      delete_image: false
    };
    if(typeof ss.id != "undefined"){ sentence.sentence_synonym_id= ss.id; }
    if(typeof ss.synonym_sentence_id != "undefined"){ sentence.synonym_sentence_id= ss.synonym_sentence_id; }
    if(typeof ss.sentence != "undefined"){ sentence.sentence= ss.sentence; }
    if(typeof ss.delete_image != "undefined" && ss.delete_image == true){ sentence.delete_image = true; }
    if(typeof ss.image != "undefined" && ss.delete_image != true ){ sentence.image = ss.image; } 

    dispatch(AdminActions.saveSentenceSynonym(this.props.article_id, sentence));
  }
  handleImageChange(e) {
    const { dispatch } = this.props;
    if(e.target.files[0].type.split('/')[0] != "image"){
      this.setState({ show_image_modal: false });
      dispatch(AdminActions.showAlert("File must be an image!"));
      return false;
    }
    var reader = new FileReader();
    let file = e.target.files[0];
    let target_sentence = this.state.target_sentence;
    let synonym_sentence = (typeof target_sentence.sentence_synonyms != "undefined" && target_sentence.sentence_synonyms.length) ? target_sentence.sentence_synonyms[0] : {};
    synonym_sentence.image = file;
    synonym_sentence.image_is_attached = true;
    synonym_sentence.delete_image = false;
    
    reader.onloadend = () => {
      synonym_sentence.image_url = reader.result;
      target_sentence.sentence_synonyms[0] = synonym_sentence;
      this.setState({ target_sentence: target_sentence, show_image_modal: false });
    }

    reader.readAsDataURL(file);
  }
  setTargetSentence(target_sentence){
    this.setState({ target_sentence: target_sentence, show_image_modal: false });
  }
  handleDeleteImage(e) {
    e.preventDefault();
    let target_sentence = this.state.target_sentence;
    let synonym_sentence = (typeof target_sentence.sentence_synonyms != "undefined" && target_sentence.sentence_synonyms.length) ? target_sentence.sentence_synonyms[0] : {};
    synonym_sentence.image = null;
    synonym_sentence.image_url = null;
    synonym_sentence.delete_image = true;
    synonym_sentence.image_is_attached = false;
    target_sentence.sentence_synonyms[0] = synonym_sentence;
    this.setState({ target_sentence: target_sentence, show_image_modal: false });
    
  }
  handleNextSentence(e) {
    e.preventDefault();
    let sentences = jQuery("."+this.props.slug+" .sentence");
    sentences.each((i) => {   
      if(jQuery(sentences[i]).hasClass("active") && (i+1) < sentences.length){ 
        jQuery(sentences[(i+1)]).click();
        return false;
      }else if(jQuery(sentences[i]).hasClass("active")){
        sentences[0].click();
        return false;
      }
    });
  }
  handleLastSentence(e) {
    e.preventDefault();
    let sentences = jQuery("."+this.props.slug+" .sentence");
    sentences.each((i) => {   
      if(jQuery(sentences[i]).hasClass("active") && (i-1) >= 0){ 
        jQuery(sentences[(i-1)]).click();
        return false;
      }else if(jQuery(sentences[i]).hasClass("active")){
        sentences[(sentences.length-1)].click();
        return false;
      }
    });
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(SentenceSynonyms);
