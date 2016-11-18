import React, { PropTypes } from 'react';
import * as Figures         from './figures'

export default class Figure extends React.Component {
  static propTypes = {
    element: PropTypes.any.isRequired,
  };

  render() {
    const { element, activity, displayLanguage, wordClickHelper: wch } = this.props;
    let className = `content-element ce-figure ce-figure--${element.slug}`;

    let getFigure = () => {
      switch(element.slug) {
        case 'structure-table':
          return (<Figures.StructureTableFigure element={element} activity={activity} wordClickHelper={wch} displayLanguage={displayLanguage} />);
        case 'signaling-words':
          return (<Figures.SignalingWordsFigure element={element} activity={activity} wordClickHelper={wch} displayLanguage={displayLanguage} />);
        case 'main-idea-pattern':
          return (<Figures.MainIdeaPatternFigure structure={element.structure} wordClickHelper={wch}  displayLanguage={displayLanguage} />);
        case 'writing-pattern':
          return (<Figures.WritingPatternFigure structure={element.structure} wordClickHelper={wch}  displayLanguage={displayLanguage} />);
      }
    };

    return (
      <div className={className}>
        {getFigure()}
      </div>
    );
  }
}
