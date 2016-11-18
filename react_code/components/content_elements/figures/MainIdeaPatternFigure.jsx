import React, { PropTypes } from 'react';
import LanguagePrefixHelper from '../../../helpers/LanguagePrefixHelper';

export default class MainIdeaPatternFigure extends React.Component {
  static propTypes = {
    structure: PropTypes.any.isRequired,
  };

  render() {
    const { structure, displayLanguage } = this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, structure)

    let structureHeader = lph.assembleFigure('name') + " Main Idea Pattern"

    // TODO: Extract structure constant from Key.jsx
    // so that content is usable elsewhere.
    let getContent = () => {
      switch(lph.assembleFigure("name")) {
        case 'Comparison':
          return (
            <div>
              <p><span className="o-blank"></span> and <span className="o-blank"></span> <span>(<em>two or more ideas</em>)</span></p>
              <p>were compared on <span className="o-blank"></span>,</p>
              <p><span className="o-blank"></span>, and <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Comparación':
          return (
            <div>
              <p><span className="o-blank"></span> y <span className="o-blank"></span> <span>(<em>dos o más ideas</em>)</span></p>
              <p>fueron comparados <span className="o-blank"></span>,</p>
              <p><span className="o-blank"></span>, y <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Problem & Solution':
          return (
             <div>
              <p>The problem is <span className="o-blank"></span>,</p>
              <p>and the solution is <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Problema y Solución':
          return (
             <div>
              <p>El problema es <span className="o-blank"></span>,</p>
              <p>y la solución es <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Cause & Effect':
          return (
            <div>
              <p>The cause(s) is/are <span className="o-blank"></span></p>
              <p>and the effect(s) is/are <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Causa y Efecto':
          return (
            <div>
              <p>La causa es <span className="o-blank"></span></p>
              <p>y el efecto es <span className="o-blank"></span>.</p>
            </div>
          );
        default:
          return (
            <div></div>
          );
      }
    };

    return (
      <div className="ce-figure__inner">
        <div className="ce-figure__header">
          {structureHeader}
        </div>
        <div className="ce-figure__body">
          {getContent()}
        </div>
      </div>
    );
  }
}
