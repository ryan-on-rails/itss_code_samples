import React, { PropTypes }    from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Modal,DropdownButton, MenuItem }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';

class WordTranslations extends React.Component {  
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {content: null, word_count: 0, target_sentence_id: null, target_word: {id: null, content: "",translations: []}};
  }

  componentDidMount() {
    var word_count = 0;

    this.props.paragraph_collection.forEach((paragraph,i) => {
      paragraph.sentences.forEach((sentence,index) => {
        sentence.words = sentence.words.map((word,t) => {
          word_count += 1;
          word.word_index = word_count;
          return word;
        });
      });
    });

    this.setState({ word_count: word_count });
    jQuery("."+this.props.slug+" .word").first().click();
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    var word_count = 0;
    var target_word = this.state.target_word;

    this.props.paragraph_collection.forEach((paragraph,i) => {
      paragraph.sentences.forEach((sentence,index) => {
        sentence.words = sentence.words.map((word,t) => {
          word_count += 1;
          word.word_index = word_count;
          if(word.word_index == target_word.word_index){
            target_word = word;
            target_word.translations.forEach((tw,tw_i) => {
              if(tw.id == target_word.default_translation_id){target_word.translation_word_index = tw_i;}
            });
          }
          return word;
        });
      });
    });
    this.setState({ word_count: word_count, target_word: target_word });
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let target_word = this.state.target_word;
    let symbols = [".",",","!","?",";",":","(",")","=","-"];
    let left_space_symbols = ["(","=","-"];
    
    let get_markup_word = (word,sentence_id, i) => {
      let class_name = "";

      if(symbols.indexOf(word.content) >= 0){
        var space = left_space_symbols.indexOf(word.content) >= 0 ? " " : "";
        return (<span key={`word-${i}-${word.id}`}>{space}{word.content}</span>);
      }
      if(word.translations.length <= 0){
        class_name = "no-translations";
      }else if(word.translations.length > 1) {
        class_name = "multiple-translations";
      }else{
        class_name = "has-translation";
      }
      if(word.id == target_word.id){ class_name += " active";}
      return (<span onClick={e => this.handleWordClick(e, word, sentence_id )} className={`word ${class_name}`} key={`word-${i}-${word.id}`}> {word.content}</span>);
    }
    let get_markup_sentence = (sentence, i) => {
      let words = sentence.words.map((word, i) => { return get_markup_word(word, sentence.id, i); });
      return (<span className="sentence" key={`sentence-${i}`}>{words} </span>);
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
    let get_translation_select_options = () => {
      if(target_word.translations.length < 1){ return; }
      if(target_word.translations.length == 1 && target_word.translations[(target_word.translation_word_index || 0)].content != null && target_word.translations[(target_word.translation_word_index || 0)].content != ""){ 
        return(<button className="add-translation" onClick={e => this.handleAddTranslationClick(e)}>
            <i className="fa fa-plus" aria-hidden="true"></i> Add a Translation
          </button>
        );
      }
      let options = target_word.translations.map((translation, ti) => { 
        var default_class = (translation.id == target_word.default_translation_id) ? "default_translation" : "";
        var default_icon = (translation.id == target_word.default_translation_id) ? "fa-check-circle" : "fa-check-circle-o";
        return(
          <MenuItem key={`translation-${ti}-${translation.id}`} onClick={e => this.handleEditTranslationClick(e, ti)} className={default_class} >
            <span>{translation.content} </span>
            <button onClick={e => this.handleRemoveTranslationClick(e, ti)} className="delete-translation"><i className="fa fa-times"/></button>
            <button onClick={e => this.handleSetDefaultTranslationClick(e, ti)} className="edit-translation"><i className={`fa ${default_icon}`}/></button>
          </MenuItem>
        );
      });
      options.push(<MenuItem key="new-translation" onClick={e => this.handleAddTranslationClick(e)} ><span>Add Translation </span></MenuItem>);
      return (
        <div className="multi-translations-dropdown">
          <DropdownButton title="Choose a translation" className="" id={`translation-dropdown-${this.props.slug}`}> {options}</DropdownButton>
        </div>
      );
    }

    let word_translation_input = () => {
      if(!target_word ){
        return;
      }
      if(typeof target_word.translations == "undefined") { 
        target_word.translations = []; 
      }
      let language_abbv = target_word.language_abbv == "en" ? "es": "en";
      let translation_word = target_word.translations[target_word.translation_word_index] || {content: "", language_abbv: language_abbv};

      return (
        <label>
          <span className="col-md-4 target_word">{target_word.content}</span>
          <input className="col-md-8 target_word-input" type="text" 
            onChange={(e) => this.handleTranslationWordEdit(e)}
            value={(translation_word.content || " ")} />
        </label>
      );
    }
    let title = "";
    let title_class = "";
    if(target_word.translations.length == 1){
      title = "One Translation";
      title_class = "single-translation";
    }else if(target_word.translations.length > 1){      
      title = "Multiple Translations";
      title_class = "multi-translations";
    }else{
      title = "No Translations";
      title_class = "no-translations";
    }
    return(         
      <div>       
        <div className={`content`}>
          {get_markup_paragraphs()}
        </div>
        <div className="work-area">
          <div className="col-md-10">
            <div className="col-md-12">
              <h4 className={`translation-title ${title_class}`}>{title}</h4>
            </div>
            {word_translation_input()}
            <div className="col-md-12">
              <div className="col-md-3">
                <span className="word-counter">{target_word.word_index || 0}/{this.state.word_count || 0}</span>
                <div className="word-arrows">
                  <i className="fa fa-caret-left" aria-hidden="true" onClick={e => this.handleLastWord(e)}></i>
                  <i className="fa fa-caret-right" aria-hidden="true" onClick={e => this.handleNextWord(e)}></i>
                </div>
              </div>
              <div className="col-md-8 sentence-image">                
                {get_translation_select_options()}
              </div>
            </div>
            <div className="clearfix"/>
          </div>
          <div className="col-md-2">
            <div className="edit-button-container">
              <button className="btn btn-primary btn-circle save-word-translation" onClick={e => this.handleSaveWord(e)}><i className="fa fa-check" aria-hidden="true"></i></button>
            </div>
          </div>
          <div className="clearfix"/>
        </div>
      </div>
    );
  }


  handleTranslationWordEdit(e) {
    let target_word = this.state.target_word; 
    if(target_word.translations.length == 0){
      let language_abbv = target_word.language_abbv == "en" ? "es": "en";
      target_word.translations.push({content: "", language_abbv: language_abbv}) ;
      target_word.translation_word_index = 0;
    }
    target_word.translations[target_word.translation_word_index].content = e.target.value;
    this.setState({ target_word: target_word });
  }
  handleWordClick(e, word, sentence_id) {
    jQuery("."+this.props.slug+" .word.active").removeClass("active");
    jQuery(e.target).addClass("active");
    word.translation_word_index = 0;
    if(word.default_translation_id != null && word.translations.length > 0){
      word.translations.forEach((tw, tw_i)=>{
        if(tw.id == word.default_translation_id){
          word.translation_word_index = tw_i;
        }
      });
    }
    this.setState({ target_word: word, target_sentence_id: sentence_id });
  }
  handleEditTranslationClick(e, translation_word_index) {
    e.preventDefault();
    let target_word = this.state.target_word;
    target_word.translation_word_index = translation_word_index;
    this.setState({ target_word: target_word });
  }
  handleSetDefaultTranslationClick(e, translation_word_index) {
    e.preventDefault();
    let target_word = this.state.target_word;
    target_word.translation_word_index = translation_word_index;
    target_word.default_translation_id = target_word.translations[translation_word_index].id;
    this.setState({ target_word: target_word });
  }
  handleAddTranslationClick(e) {
    e.preventDefault();
    let target_word = this.state.target_word;
    let language_abbv = target_word.language_abbv == "en" ? "es": "en";
    target_word.translations.push({content: "", language_abbv: language_abbv}) ;
    target_word.translation_word_index = target_word.translations.length-1;
    this.setState({ target_word: target_word });
    jQuery("."+this.props.slug+" .target_word-input").focus();
  }
  handleRemoveTranslationClick(e, translation_word_index) {
    e.preventDefault();
    let target_word = this.state.target_word;
    target_word.translations.splice(translation_word_index, 1) ;
    if(translation_word_index == target_word.translation_word_index) {
      target_word.translation_word_index = 0;
    }else if(target_word.translation_word_index > target_word.translations.length-1){
      target_word.translation_word_index = target_word.translations.length-1;
    }
    this.setState({ target_word: target_word });
  }
  handleSaveWord(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(AdminActions.saveWordTranslation(this.props.article_id, this.state.target_word, this.state.target_sentence_id));
  }
  handleNextWord(e) {
    e.preventDefault();
    let words = jQuery("."+this.props.slug+" .word");
    if(jQuery("."+this.props.slug+" .word.active").length == 0){
      words[0].click();
    }else{
      words.each((i) => {   
        if(jQuery(words[i]).hasClass("active") && (i+1) < words.length){ 
          jQuery(words[(i+1)]).click();
          return false;
        }else if(jQuery(words[i]).hasClass("active")){
          words[0].click();
          return false;
        }
      });
    }
  }
  handleLastWord(e) {
    e.preventDefault();
    let words = jQuery("."+this.props.slug+" .word");

    if(jQuery("."+this.props.slug+" .word.active").length == 0){
      words[(words.length-1)].click();
    }else{
      words.each((i) => {   
        if(jQuery(words[i]).hasClass("active") && (i-1) >= 0){ 
          jQuery(words[(i-1)]).click();
          return false;
        }else if(jQuery(words[i]).hasClass("active")){
          words[(words.length-1)].click();
          return false;
        }
      });
    }
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(WordTranslations);
