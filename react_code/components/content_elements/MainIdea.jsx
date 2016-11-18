import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import LanguagePrefixHelper      from '../../helpers/LanguagePrefixHelper';
import TranslativeTextarea  from '../TranslativeTextarea';


class MainIdea extends React.Component {
  static propTypes = {
    element: PropTypes.any.isRequired,
  };

  render() {
    const { element, wordClickHelper: wch, displayLanguage, user } = this.props;
    const { article } = element;
    let lph = new LanguagePrefixHelper(displayLanguage, article);
    let paragraphs = lph.assemble("main_idea_paragraphs");

    return (
      <div className="content-element ce-main-idea">
        <h2 className="ce-heading">{(displayLanguage == "es" ? "Idea Principal" : "Main Idea")}</h2>
        <h3>{lph.assemble("structure_name")}</h3>
        <TranslativeTextarea content={paragraphs} is_clickable={element.clickable} wordClickHelper={wch} show_hybrid={user.is_hybrid} />
      </div>
    );
  }
}
function select(state) {
  return state;
}

export default connect(select)(MainIdea);
