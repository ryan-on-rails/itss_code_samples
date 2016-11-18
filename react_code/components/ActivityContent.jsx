import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import * as CE              from './content_elements';
import * as ActivityActions from '../actions/ActivityActions';
import WordClickHelper      from '../helpers/WordClickHelper';
import TextContentHelper      from '../helpers/TextContentHelper';

class ActivityContent extends React.Component {
  static propTypes = {
    elements: PropTypes.any.isRequired,
    activity: PropTypes.any.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { elements, activity, dispatch, displayLanguage, user} = this.props;
    let content = elements.map((el, key) => {
      let type = el.type.match(/(.*)ContentElement/)[1];
      let wch;
      let getWCH = () => {
        switch(activity.type) {
          // NOTE: The WordClickHelper instance functions to mark up
          // a selection of text such that words/phrases can be
          // clicked by the student. The constructor takes the activity
          // and a callback function to be called when a word/phrase is
          // clicked.
          case 'MatrixActivity':
            return new WordClickHelper(activity, user.preferred_language, user.is_hybrid, (e, w) => {
              let element = jQuery(e.target).closest(".ce-word");
              if(element.hasClass('ce-word--selected')){ return;}

              let cellId = activity.selectedMatrixCellId,
                  question = activity.matrix_questions.find(q => q.id === cellId),
                  full;

              if(!cellId) { return; }
              full = (activity.matrixWords &&
                      activity.matrixWords[cellId] &&
                      activity.matrixWords[cellId].length === question.words.length);

              if(full) { return; }
              element.addClass('ce-word--selected');
              dispatch(ActivityActions.addMatrixWord(activity.selectedMatrixCellId, w));
            });
          case 'FindAndClickActivity':
            return new WordClickHelper(activity, user.preferred_language, user.is_hybrid, (e, w) => {
              let element = jQuery(e.target).closest(".ce-word");
              if(element.hasClass('ce-word--selected')){ return;}
              let full = (activity.selectedWords &&
                          activity.selectedWords.length === activity.question.words.length)

              if(full) { return; }
              element.addClass('ce-word--selected');
              dispatch(ActivityActions.addSelectedWord(w));
            });
          default:
            return new WordClickHelper(activity, user.preferred_language, user.is_hybrid, (e, w) => {});
        }
      }

      wch = getWCH();
      switch(type) {
        case 'Article':
          return (<CE.Article element={el} key={key} activity={activity} wordClickHelper={wch} displayLanguage={displayLanguage} />);
        case 'Figure':
          return (<CE.Figure element={el} key={key} activity={activity} wordClickHelper={wch}  displayLanguage={displayLanguage} />);
        case 'MainIdea':
          return (<CE.MainIdea element={el} key={key} wordClickHelper={wch} displayLanguage={displayLanguage} />);
        case 'Recall':
          return (<CE.Recall element={el} key={key} wordClickHelper={wch} displayLanguage={displayLanguage} />);
        case 'RichText':
          return (<CE.RichText element={el} activity={activity} key={key} wordClickHelper={wch}  displayLanguage={displayLanguage} />);
        case 'Answer':
          return (<CE.Answer element={el} activity={activity} key={key} />);
        case 'Media':
          return (<CE.Media element={el} activity={activity} key={key} />);
        default:
          return (<div />);
      }
    });

    return (
      <div className="act-panel__inner">
        {content.length ? content : <div />}
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ActivityContent);
