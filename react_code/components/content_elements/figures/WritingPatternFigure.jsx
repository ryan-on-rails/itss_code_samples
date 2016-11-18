import React, { PropTypes } from 'react';
import LanguagePrefixHelper from '../../../helpers/LanguagePrefixHelper';


export default class WritingPatternFigure extends React.Component {
  static propTypes = {
    structure: PropTypes.any.isRequired,
  };

  render() {
    const { structure, displayLanguage } = this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, structure)

    let structureHeader = lph.assembleFigure("name") + " Writing Pattern";

    let getContent = () => {
      switch(lph.assembleFigure("name")) {
        case 'Comparison':
          return (
            <div>
              <p>Sequence with a comparison signaling word contrasting the two ideas.</p>
              <p>The first idea is <span className="o-blank"></span> (describes the topics for this idea).</p>
              <p>In contrast, the second idea is <span className="o-blank"></span> (describes the topics for this idea).</p>
            </div>
          );
        case 'Comparación':
          return (
            <div>
              <p>Sequence with a comparison signaling word contrasting the two ideas.</p>
              <p>The first idea is <span className="o-blank"></span> (describes the topics for this idea).</p>
              <p>In contrast, the second idea is <span className="o-blank"></span> (describes the topics for this idea).</p>
            </div>
          );
        case 'Problem & Solution':
          return (
             <div>
              <p>The problem is <span className="o-blank"></span> [paragraph(s) includes a description</p>
              <p>of the problem and, if known, its cause(s)] <span className="o-blank"></span>.</p>
              <br/>
              <p>The solution is <span className="o-blank"></span> [paragraph(s) include a</p>
              <p>description of the solution and how it gets rid of</p>
              <p>the cause(s) of the problem(s) or tries to] <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Problema y Solución':
          return (
             <div>
              <p>El problema es <span className="o-blank"></span> [paragraph(s) includes a description</p>
              <p>of the problem and, if known, its cause(s)] <span className="o-blank"></span>.</p>
              <br/>
              <p>La solución es <span className="o-blank"></span> [paragraph(s) include a</p>
              <p>description of the solution and how it gets rid of</p>
              <p>the cause(s) of the problem(s) or tries to] <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Cause & Effect':
          return (
             <div>
              <p>The cause is <span className="o-blank"></span> [paragraph(s) includes a description</p>
              <p>of the cause of the situation] <span className="o-blank"></span>.</p>
              <br/>
              <p>The effect is <span className="o-blank"></span> [paragraph(s) include a</p>
              <p>description of the effects or results] <span className="o-blank"></span>.</p>
            </div>
          );
        case 'Causa y Efecto':
          return (
             <div>
              <p>La causa es <span className="o-blank"></span> [paragraph(s) includes a description</p>
              <p>of the cause of the situation] <span className="o-blank"></span>.</p>
              <br/>
              <p>El efecto es <span className="o-blank"></span> [paragraph(s) include a</p>
              <p>description of the effects or results] <span className="o-blank"></span>.</p>
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
