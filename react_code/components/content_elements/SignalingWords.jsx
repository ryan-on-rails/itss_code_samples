import React, { PropTypes } from 'react';
import marked               from '../../lib/marked';
import LanguagePrefixHelper      from '../../helpers/LanguagePrefixHelper';

export default class SignalingWords extends React.Component {
  static propTypes = {
    article: PropTypes.any.isRequired,
  };

  render() {
    const { article, displayLanguage } = this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, article);

    let markedMainIdea = marked(lph.assemble("main_idea"), { sanitize: true });

    return (
      <div className="content-element ce-main-idea">
        <h2 className="ce-heading">Main Idea</h2>
        <h3>{lph.assemble("structure_name")}</h3>
        <div dangerouslySetInnerHTML={{ __html: markedMainIdea }} />
      </div>
    );
  }
}
