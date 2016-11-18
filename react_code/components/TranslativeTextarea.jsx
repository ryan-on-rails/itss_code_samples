import React, { PropTypes }                   from 'react';
import ReactDOM                               from 'react-dom';
import { connect }                            from 'react-redux';
import { Modal, OverlayTrigger, Popover }     from 'react-bootstrap';
import marked                                 from '../lib/marked';
import TextContentHelper                      from '../helpers/TextContentHelper';
import Word                                   from './Word';

class TranslativeTextarea extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {content: null, show_hybrid: false, sentence_synonym: null, show_image_modal:false, is_clickable: false};
  }

  componentDidMount() {
    let is_clickable = this.props.is_clickable || false;
    this.setState({ content: this.props.content, show_hybrid: this.props.show_hybrid, is_clickable: is_clickable});
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    let is_clickable = nextProps.is_clickable || false;
    this.setState({ content: nextProps.content, show_hybrid: nextProps.show_hybrid, is_clickable: is_clickable });
  }

  render() {
    const { dispatch, user, wordClickHelper: wch, contentLoading, activity } = this.props;
    let content = this.state.content;
    let symbols = [".",",","!","?"];
    let tch = new TextContentHelper(content);
    if(typeof content ==  "undefined" || content == null){return (<div/>);}

    let get_markup_word = (word,sentence_id, i) => {
      return (<Word word={word} key={`word-${i}-${word.id}`} />);
    }

    let get_markup_sentence = (sentence, i) => {
      let words = sentence.words.map((word, i) => { return get_markup_word(word, sentence.id, i); });

      if(sentence.sentence_synonyms.length > 0 && this.state.show_hybrid && activity.type == "InfoActivity"){
        return (<span className="sentence has-synonym" onClick={e => this.handleShowModalClick(e, sentence.sentence_synonyms[0])} key={`sentence-${i}`}>{words} </span> );
      }else{
        return (<span className="sentence" key={`sentence-${i}`}>{words}</span>);
      }
    }

    let get_markup_paragraphs = () => {
      return content.map((paragraph, index) => {
        var sentences = paragraph.sentences.map((sentence, i) => {
            return(get_markup_sentence(sentence, i));
        });
        return (<p className="paragraph" key={`paragraph-${index}`}>{sentences}</p>);
      });
    };

    let synonym_sentence_image_modal = () => {
      let sentence_synonym = this.state.sentence_synonym;
      if(typeof sentence_synonym ==  "undefined" || sentence_synonym == null || !this.state.show_hybrid){return;}

      return(<Modal show={this.state.show_image_modal} onHide={e => this.hideImageModal(e)} dialogClassName={'synonym-sentence-image-modal student-synonym-sentence-modal'}>
            <div className="modal-close-instructions">Please click anywhere outside of this box to close this window.</div>
            <img src={((sentence_synonym.image_is_attached) ? sentence_synonym.image_url : "" )} />
            <span>{(sentence_synonym.sentence || "")}</span>
          </Modal>);
    }
    let content_view = () => {
      if((activity.type == "MatrixActivity" || activity.type == "FindAndClickActivity") && this.state.is_clickable){
        var content_obj = tch.paragraphs_to_str();
        let content_str = marked(content_obj.content, { sanitize: true });
        return(wch.decorateText(content_str, content_obj.translation_array, this.state.is_clickable));
      }else {
        return(get_markup_paragraphs());
      }
    }
    return(
      <div className="translative-textarea">
        {synonym_sentence_image_modal()}
        {content_view()}
      </div>
    );
  }

  handleTextEdit(e) {
    let article = this.state.article;
    article[e.target.name] = e.target.value;
    this.setState({ article: article });
  }
  handleShowModalClick(e, sentence_synonym){
    e.preventDefault();
    this.setState({ sentence_synonym: sentence_synonym, show_image_modal: true });
  }
  hideImageModal(e){
    this.setState({ sentence_synonym: null, show_image_modal: false });
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(TranslativeTextarea);
