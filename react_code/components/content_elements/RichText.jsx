import React, { PropTypes } from 'react';
import marked               from '../../lib/marked';
import LanguagePrefixHelper      from '../../helpers/LanguagePrefixHelper';


export default class RichText extends React.Component {
  static propTypes = {
    element: PropTypes.any.isRequired,
  };

  render() {
    const { element, activity, displayLanguage, wordClickHelper: wch } = this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, element);

    let getMarkedText = () => {
      let markedText = marked(lph.assemble("content"), { sanitize: true });
      let translations = lph.assemble("translations");

      return wch.decorateText(markedText, translations, element.clickable);
    }

    return (
      <div className="content-element ce-rich-text">
        {getMarkedText()}
      </div>
    );
  }
}
