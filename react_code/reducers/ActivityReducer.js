import * as C from '../constants/ActivityConstants';

export default function activity(state = {}, action) {
  const { type, data } = action;
  let iIndex = state.instructionIndex || 0;
  let matrixWords, selectedWords;

  switch(type) {
    case C.SHOW_ALERT:
      return Object.assign({}, state, {
        alertVisible: true, alertMessage: data.message
      });
    case C.HIDE_ALERT:
      return Object.assign({}, state, {
        alertVisible: false, alertMessage: ''
      });
    case C.CLEAR_RESPONSE:
      switch(state.type) {
        case 'MatrixActivity':
          matrixWords = {};
          state.matrix_questions.forEach(question => {
            let qID = question.id;
            let words = state.matrixWords[qID] || [];
            let downcasedWords = words.map(w => w.toLowerCase());

            matrixWords[qID] = [];

            question.words.forEach(word => {
              let i = downcasedWords.indexOf(word.content.toLowerCase());

              if(~i) {
                matrixWords[qID].push(state.matrixWords[qID][i]);
              }
            });
          });

          return Object.assign({}, state, { matrixWords: matrixWords, responding: false });
        case 'MultipleChoiceActivity':
          const mcAnswers = state.answers || [];
          const correctOptionIDs = state.question.options
            .filter(o => o.correct)
            .map(o => o.id);

          const correctAnswers = mcAnswers.filter(a => {
            return ~correctOptionIDs.indexOf(a.multiple_choice_option_id);
          });

          return Object.assign({}, state, { answers: correctAnswers });
        case 'FindAndClickActivity':
          let downcasedSelected = state.selectedWords;
          selectedWords = [];

          state.question.words.forEach(word => {
            let i = downcasedSelected.indexOf(word.content);

            if(~i) {
              selectedWords.push(state.selectedWords[i]);
            }
          });

          return Object.assign({}, state, { selectedWords: selectedWords, responding: false })
        default:
          return Object.assign({}, state, { responding: false });
      }
    case C.ADD_SELECTED_WORD:
      selectedWords = state.selectedWords || [];
      selectedWords.push(data.word);
      return Object.assign({}, state, { selectedWords: selectedWords });
    case C.REMOVE_SELECTED_WORD:
      selectedWords = state.selectedWords || [];
      let index = selectedWords.indexOf(data.word);
      if(~index) {
        selectedWords.splice(index, 1);
      }
      return Object.assign({}, state, { selectedWords: selectedWords });
    case C.UPDATE_MULTIPLE_CHOICE_ANSWERS:
      return Object.assign({}, state, { answers: data.answers || [] });
    case C.UPDATE_SELECTED_MATRIX_CELL:
      return Object.assign({}, state, { selectedMatrixCellId: data.cellId });
    case C.ADD_MATRIX_WORD:
      matrixWords = state.matrixWords || {};
      let theseMatrixWords = matrixWords[data.cellId] || [];

      if(!~theseMatrixWords.indexOf(data.word)) {
        theseMatrixWords.push(data.word);
      }

      matrixWords[data.cellId] = theseMatrixWords;
      return Object.assign({}, state, { matrixWords: matrixWords });
    case C.CLEAR_MATRIX_CELL:
      matrixWords = state.matrixWords || {};
      matrixWords[data.id] = [];
      return Object.assign({}, state, { matrixWords: matrixWords });
    case C.ACTIVATE_CURRENT_ACTIVITY:
      return Object.assign({}, state, { instructionIndex: 0, active: true });
    case C.SET_NEXT_INSTRUCTION:
      if(data.hasBeenRead === false) {
        return Object.assign({}, state, { instructionIndex: 0, instructionsRead: data.hasBeenRead });
      }
      if(iIndex === state.monologues.length - 1) {
        return Object.assign({}, state, { instructionIndex: 0, instructionsRead: data.hasBeenRead });
      } else {
        if(ENV.production) {
          return Object.assign({}, state, { instructionIndex: iIndex + 1 });
        } else {
          return Object.assign({}, state, { instructionIndex: iIndex + 1 });

          // NOTE: Skip to last instruction in development
          //return Object.assign({}, state, { instructionIndex: state.monologues.length - 1 });
        }
      }
    case C.SET_RESPONDING:
      return Object.assign({}, state, { responding: data });
    default:
      return state;
  }
}
