 import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import { Link }            from 'react-router';
import * as AdminActions      from '../../actions/AdminActions';
import * as TE                from './translation_elements';

class ArticleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {article: {id: null, en_title: "", en_body: "", en_main_idea: "", en_recall: "",
                    es_title: "", es_body: "", es_main_idea: "", es_recall: "", is_hybrid: false},
                    article_changed: false};
  }

  componentDidMount() {
    if(typeof this.props.admin.article !== "undefined"){
      this.setState({ article: this.props.admin.article, article_changed: false});
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    let article_id = this.props.routeParams.article_id;
    if(typeof article_id !== "undefined"){
      dispatch(AdminActions.getArticleData(article_id));
    }else{
      dispatch(AdminActions.resetArticleData());
    }

  }
  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.admin.article !== "undefined"){
      this.setState({ article: nextProps.admin.article, article_changed: false });
    }
  }

  render() {
    const { dispatch, user, contentLoading } = this.props;
    let article = this.state.article;
    if(typeof article ==  "undefined"){return (<div/>);}

    let article_form_class = () => {
      if (article.is_hybrid) {
        return ("itss-form narrow col-md-6");
      } else {
        return ("itss-form col-md-8 col-md-offset-2");
      }
    };

    let collapseButton = (direction) => {
      let desiredClass = "collapse-arrow fa fa-caret-";
      direction === "right" ? desiredClass = desiredClass + "right" :   desiredClass = desiredClass + "left";
      return (
        <i className={desiredClass} aria-hidden="true" onClick={e => this.handleCollapseClick(e, direction)}></i>
      )
    };

    let addSpanishButton = () => {
      if (!article.is_hybrid) {
        return (
          <div className="edit-button-container">
            <button className="btn btn-primary btn-circle add-language" onClick={e => this.handleAddLanguageClick(e)}><i className="fa fa-plus" aria-hidden="true"></i></button>
            <span>Spanish</span>
          </div>
        )
      } else {
        return (<div></div>)
      }
    }

    let article_form = (language) => {
      let full_language = "English";
      if (language === "es") {full_language = "Spanish"};
      return (
        <form className={article_form_class()}>
          <TE.TranslativeTextarea
            title="Article Title"
            language_abbv={language}
            language={full_language}
            slug={`${language}_title`}
            article_id={(article.id || null)}
            content={article[language + "_title"] || ""}
            paragraph_collection={article[language + "_title_paragraphs"] || []}
            default_rows="1"
            show_textarea={(typeof article.id == "undefined" || article.id ==null)}
            handleTextEdit={(e) => this.handleTextEdit(e, language + "_title")}
            article_is_hybrid={article.is_hybrid}
            show_simple_sentence_button={false}
            show_word_translation_button={true}
            />
          <TE.TranslativeTextarea
            title="Article Passage"
            language_abbv={language}
            language={full_language}
            slug={`${language}_body`}
            article_id={(article.id || null)}
            content={article[language + "_body"] || ""}
            paragraph_collection={article[language + "_body_paragraphs"] || []}
            show_textarea={(typeof article.id == "undefined" || article.id ==null)}
            handleTextEdit={(e) => this.handleTextEdit(e, language + "_body")}
            article_is_hybrid={article.is_hybrid}
            show_simple_sentence_button={true}
            show_word_translation_button={true}
            />
          <TE.TranslativeTextarea
            title="Article Main Idea"
            language_abbv={language}
            language={full_language}
            slug={`${language}_main_idea`}
            article_id={(article.id || null)}
            content={article[language + "_main_idea"] || ""}
            paragraph_collection={article[language + "_main_idea_paragraphs"] || []}
            show_textarea={(typeof article.id == "undefined" || article.id ==null)}
            handleTextEdit={(e) => this.handleTextEdit(e, language + "_main_idea")}
            article_is_hybrid={article.is_hybrid}
            show_simple_sentence_button={true}
            show_word_translation_button={true}
            />
          <TE.TranslativeTextarea
            title="Article Recall"
            language_abbv={language}
            language={full_language}
            slug={`${language}_recall`}
            article_id={(article.id || null)}
            content={article[language + "_recall"] || ""}
            paragraph_collection={article[language + "_recall_paragraphs"] || []}
            show_textarea={(typeof article.id == "undefined" || article.id ==null)}
            handleTextEdit={(e) => this.handleTextEdit(e, language + "_recall")}
            article_is_hybrid={article.is_hybrid}
            show_simple_sentence_button={true}
            show_word_translation_button={true}
            />
        </form>
      )
    };

    let article_area = () => {
      if (article.is_hybrid) {
        return (
          <div className="article-edit-body" >
            {article_form("en")}
            <div className="separation-container">
              {collapseButton("left")}
              <img className="separator-line" src='/media/other/line.png'></img>
              {collapseButton("right")}
            </div>
            {article_form("es")}
            <div className="clearfix"></div>
          </div>
        )
      } else {
        return (
          <div className="article-edit-body" >
            {article_form("en")}
            <div className="clearfix"></div>
          </div>
        )
      }
    };

    return(
      <div className="article-edit-panel">
        <div className="article-container" >
          <div className="article-edit-header">
            <span className="admin-location col-md-1 col-sm-1 col-md-offset-1 col-sm-offset-1">
              <Link to={`/admin/articles`} type='button' className='back-arrow'>
                  <i className="fa fa-arrow-left" aria-hidden="true" />
              </Link>
            </span>
            <div className="form-group article-page-header col-md-3 col-sm-3 ">
              {(article.id ? "Edit Article" : "Create New Article")}
            </div>
            <div className="form-group col-md-2 col-md-offset-3 col-sm-2 col-sm-offset-0">
              <select className="form-control structure-select "
                name="structure_id"
                onChange={(e) => this.handleTextEdit(e, "structure_id")}
                defaultValue={0}
                value={article.structure_id}>
                  <option value="0" disabled={true}> Choose a Text Structure</option>
                  <option value="1">Comparison</option>
                  <option value="2">Problem & Solution</option>
                  <option value="3">Cause & Effect</option>
              </select>
            </div>
            <div className="edit-buttons col-md-2 col-sm-3 col-md-offset-0 col-sm-offset-1">
              {addSpanishButton()}
              <div className={`edit-button-container ${this.state.article_changed ? "disabled" : ""}`}>
                <button className={`btn btn-primary btn-circle save-article ${(this.state.article_changed ? "" : "disabled")}`} onClick={e => this.handleSaveArticleClick(e)}><i className="fa fa-check" aria-hidden="true"></i></button>
                <span>Save</span>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
          {article_area()}
        </div>
      </div>
    )
  }

  handleSaveArticleClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    let article = this.state.article;
    if(this.isArticleValid() && this.state.article_changed){
      delete article.structure_name;
      delete article.en_title_paragraphs;
      delete article.en_body_paragraphs;
      delete article.en_main_idea_paragraphs;
      delete article.en_recall_paragraphs;
      delete article.es_title_paragraphs;
      delete article.es_body_paragraphs;
      delete article.es_main_idea_paragraphs;
      delete article.es_recall_paragraphs;
      dispatch(AdminActions.saveArticle(article));
    }
  }

  handleTextEdit(e, attri) {
    let article = this.state.article;
    article[attri] = e.target.value;
    this.setState({ article: article, article_changed: true });
  }

  handleAddLanguageClick(e) {
    let article = this.state.article;
    article.is_hybrid = true;
    this.setState({ article: article });
  }

  hideColumn(column) {
    column.addClass('collapsed').removeClass('expanded').hide();
  }

  showColumn(column) {
    column.addClass('expanded').removeClass('collapsed').show();
  }

  resetColumns(){
    $("form:first").show().removeClass("expanded collapsed");
    $("form:last").show().removeClass("expanded collapsed");
    $(".fa-caret-left").show();
    $(".fa-caret-right").show();
  }

  handleCollapseClick(e, direction) {
    if (direction === "left") {
      if($("form:first").hasClass('expanded')) {
        this.resetColumns();
      } else {
        this.showColumn($( "form:last" ))
        this.hideColumn($( "form:first" ))
        $(".fa-caret-left").hide()
      }
    } else {
      if($("form:last").hasClass('expanded')) {
        this.resetColumns();
      } else {
        this.showColumn($( "form:first" ))
        this.hideColumn($( "form:last" ))
        $(".fa-caret-right").hide()
      }
    }
  }

  handleCancelClick(e) {
    e.preventDefault();
    $( ".admin-container" ).removeClass( "toggled" );
  }
  isArticleValid(){
    let article = this.state.article;
    const { dispatch } = this.props;
    let error_msgs = [];
    if(typeof article.structure_id === "undefined" || article.structure_id === null){ error_msgs.push("Structure is invalid."); }
    if(typeof article.en_title === "undefined" || article.en_title === ""){ error_msgs.push("English title is invalid."); }
    if(article.is_hybrid && (typeof article.es_title === "undefined" || article.es_title === "")){ error_msgs.push("Spanish title is invalid."); }

    if(error_msgs.length > 0){
      dispatch(AdminActions.showAlert(error_msgs.join("\n\n")));
      return false;
    }else{
      return true;
    }
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(ArticleEdit);
