import React, { PropTypes } from 'react';
import marked               from '../../../lib/marked';
import LanguagePrefixHelper from '../../../helpers/LanguagePrefixHelper';


export default class SignalingWordsFigure extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired,
    element: PropTypes.any.isRequired,
  };

  render() {
    const { activity, element, displayLanguage, wordClickHelper: wch } = this.props;
    const { structure } = element;

    let lph = new LanguagePrefixHelper(displayLanguage, structure)
    let translations = lph.assemble("translations");

    let tableHeading = `Important Table for the ${lph.assembleFigure("name")} Structure`;
    let signalingHeading = `Signaling Words Used in the ${lph.assembleFigure("name")} Structure`;

    if (displayLanguage === 'es') {
      tableHeading = `Tabla Importante para la Estructure de ${lph.assembleFigure("name")}`;
      signalingHeading = `Las palabras seneladas que se usan en la estructura de ${lph.assembleFigure("name")}`;
    }

    return (
      <div className="ce-figure__inner">
        <div className="ce-figure__header">
          {this.getDecoratedText(signalingHeading, translations)}
        </div>
        <table className="ce-table table">
          <tbody>
            <tr>
              <td>{this.getDecoratedText(lph.assembleFigure("signaling_words"), translations)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  getDecoratedText(text, translations=[]) {
    // let markedText = marked(text, { sanitize: true });
    const { activity, element, wordClickHelper: wch } = this.props;
    return wch.decorateText(text, translations, element.clickable);
  }
}
