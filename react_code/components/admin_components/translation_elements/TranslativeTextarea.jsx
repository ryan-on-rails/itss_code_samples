import React, { PropTypes }    from 'react';
import ReactDOM               from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import SentenceSynonyms       from './SentenceSynonyms';
import WordTranslations       from './WordTranslations';

class TranslativeTextarea extends React.Component {  
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {content: null, show_textarea: false, show_word_traslate: false, show_simple_sentence: false};
  }

  componentDidMount() {
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let content = this.state.content;
    if(typeof content ==  "undefined"){return (<div/>);}

    let language_label = () => {
      var language = this.props.language ? this.props.language : "English";
      return (
        <div className="article-language-label">
          {language}
        </div>
      );
    };
    let get_edit_button = () => {
      return (
        <a className="edit-toggle-button" onClick={e => this.handleToggleEditClick(e)}><i className="fa fa-pencil" aria-hidden="true"></i> Edit</a>
      );
    };

    let get_exit_button = () => {
      return (
        <a className="exit-toggle-button" onClick={e => this.handleExitCurrentScreenClick(e)}><i className="fa fa-times" aria-hidden="true"></i></a>
      );
    };
    let get_word_translation_button = () =>{
      if(this.props.show_word_translation_button && this.props.article_is_hybrid){
        return(
          <button className="btn translate-btn add-word-translations" onClick={e => this.handleToggleWordTransClick(e)}>
            <i className="fa fa-expand" aria-hidden="true"></i> Translate Words
          </button>
        );
      }
    }
    let get_simple_sentences_button = () =>{
      if(this.props.show_simple_sentence_button && this.props.article_is_hybrid){
        return(
          <button className="btn translate-btn add-word-translations" onClick={e => this.handleToggleSentenceSimpleClick(e)}>
            <i className="fa fa-code-fork" aria-hidden="true"></i> Simplify Sentences
          </button>
        );
      }
    }
    let content_view = ()=>{
      if(this.props.show_textarea == true || this.state.show_textarea == true){
        return(
          <div className={`blob-edit-article-content ${this.props.slug}`}>
            <div className="form-group">
              <label>{this.props.title}</label>
              {language_label()}
              {(this.state.show_textarea == true ? get_exit_button() :"")}
              <textarea className="form-control"
                rows={(this.props.default_rows ? this.props.default_rows : "5")}
                placeholder={this.props.title}
                onChange={(e) => this.props.handleTextEdit(e)}
                value={this.props.content || ""} />
            </div>
          </div>
        );
      }else if(this.props.article_is_hybrid == true && this.state.show_word_traslate == true){
        return(
          <div className={`word-translation-content ${this.props.slug}`}>
            <div className="form-group">
              <label>{this.props.title}</label>
              {language_label()}
              {get_exit_button()}
              <WordTranslations article_id={this.props.article_id} slug={this.props.slug} paragraph_collection={this.props.paragraph_collection}/>
            </div>
          </div>
          );
      }else if(this.props.article_is_hybrid == true && this.state.show_simple_sentence == true){
        return(
          <div className={`simple-sentences-content ${this.props.slug}`}>
            <div className="form-group">
              <label>{this.props.title}</label>
              {language_label()}
              {get_exit_button()}
              <SentenceSynonyms article_id={this.props.article_id} slug={this.props.slug} paragraph_collection={this.props.paragraph_collection}/>
            </div>
          </div>
          );
      }else{
        return(
          <div className={`plain-text-article-content ${this.props.slug}`}>
            <div className="form-group">
              <label>{this.props.title}</label>
              {language_label()}
              {get_edit_button()}
                
              <div className="content">
                {this.props.content.split("\n\n").map((p, i) => { return(<p key={`p-${i}`}>{p}</p>);}) || ""}
              </div>
              {get_simple_sentences_button()}
              {get_word_translation_button()}
            </div>
          </div>
        );
      }
    }
    

    return(
      <div className="translative-textarea">
        {content_view()}
      </div>
    );
  }

  handleTextEdit(e) {
    let article = this.state.article;
    article[e.target.name] = e.target.value;
    this.setState({ article: article });
  }
  handleToggleEditClick(e) {
    e.preventDefault();
    this.setState({ show_textarea: !this.state.show_textarea, show_word_traslate: false, show_simple_sentence: false });
  }
  handleToggleWordTransClick(e) {
    e.preventDefault();
    this.setState({ show_word_traslate: !this.state.show_word_traslate, show_textarea: false, show_simple_sentence: false  });
  }
  handleToggleSentenceSimpleClick(e) {
    e.preventDefault();
    this.setState({ show_simple_sentence: !this.state.show_simple_sentence, show_textarea: false, show_word_traslate: false  });
  }
  handleExitCurrentScreenClick(e) {
    e.preventDefault();
    this.setState({ show_simple_sentence: false, show_textarea: false, show_word_traslate: false  });
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(TranslativeTextarea);
