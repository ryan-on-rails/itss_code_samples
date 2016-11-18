import React, { PropTypes } from 'react';
import marked               from '../../../lib/marked';
import LanguagePrefixHelper from '../../../helpers/LanguagePrefixHelper';


export default class StructureTableFigure extends React.Component {
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
    let exampleText = "For example:"

    if (displayLanguage === 'es') {
      tableHeading = `Tabla Importante para la Estructure de ${lph.assembleFigure("name")}`;
      signalingHeading = `Las palabras seneladas que se usan en la estructura de ${lph.assembleFigure("name")}`;
      exampleText = "Por ejemplo:"
    }

    return (
      <div className="ce-figure__inner">
        <div className="ce-figure__header">
          {this.getDecoratedText(tableHeading, translations)}
        </div>
        <table className="ce-table table">
          <thead>
            <tr>
              <th>{this.getDecoratedText(lph.assembleFigure("name"), translations)}</th>
              <th>{this.getDecoratedText(signalingHeading, translations)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.getDecoratedText(lph.assembleFigure("description"), translations)}</td>
            <td rowSpan="2">{this.getDecoratedText(lph.assembleFigure("signaling_words"), translations)}</td>
            </tr>
            <tr>
              <td>
                {exampleText}
                {this.getDecoratedText(lph.assembleFigure("example"), translations)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  getDecoratedText(text, translations=[]) {
    const { activity, element, wordClickHelper: wch } = this.props;
    let markedText = marked(text, { sanitize: true });

    return wch.decorateText(markedText, translations, element.clickable);
  }
}
