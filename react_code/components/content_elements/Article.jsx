import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import marked               from '../../lib/marked';
import TranslativeTextarea  from '../TranslativeTextarea';
import LanguagePrefixHelper from '../../helpers/LanguagePrefixHelper';

class Article extends React.Component {
  static propTypes = {
    element: PropTypes.any.isRequired,
    activity: PropTypes.any.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { element, displayLanguage, activity, wordClickHelper: wch, user } = this.props;
    const { article } = element;
    let lph = new LanguagePrefixHelper(displayLanguage, article);

    let getArticleTitle = () => {
      let titleContent = '';

      if(element.show_title) {
        var paragraph_collection = lph.assemble("title_paragraphs");
        titleContent = (
          <TranslativeTextarea content={paragraph_collection}
            wordClickHelper={wch}
            show_hybrid={user.is_hybrid}
            is_clickable={element.clickable} />);
      }

      return (titleContent ? (<h3 className="ce-article__title">{titleContent}</h3>) : '');
    }

    let getArticleBody = () => {

      var paragraph_collection = lph.assemble("body_paragraphs");
      return (<TranslativeTextarea content={paragraph_collection} is_clickable={element.clickable} wordClickHelper={wch} show_hybrid={user.is_hybrid} />);
    }

    return (
      <div className="content-element ce-article">
        {getArticleTitle()}
        <div className="ce-article__body">
          {getArticleBody()}
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Article);
