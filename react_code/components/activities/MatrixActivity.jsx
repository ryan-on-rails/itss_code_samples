import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import * as ActivityActions from '../../actions/ActivityActions';
import * as UserActions       from '../../actions/UserActions';
import MatrixResponse       from '../../models/responses/MatrixResponse';

class MatrixActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  componentDidMount() {
    const { activity, dispatch } = this.props;
    activity.matrix_questions.forEach((question)=>{
      if(question.populate){
        question.words.forEach((word)=>{
          dispatch(ActivityActions.addMatrixWord(question.id, word.content));
        });
      }
    })
    
  }

  render() {
    const { activity, responseDisabled, user } = this.props;
    if(activity.type != "MatrixActivity") {return(<div />);}

    let matrixWords = activity.matrixWords || {};
    let colHeaders = activity.matrix_columns.map((column, key) => {
      return (
        <th key={key}>
          <div className="matrix-header">
            <span>{column.label}</span>
          </div>
        </th>
      );
    });

    let headerRow = (<thead><tr><th><button id="clearButton" className="o-btn-clear matrix-clear" onClick={() => this.handleClearClick()}>Clear</button></th>{colHeaders}</tr></thead>);

    let rows = activity.matrix_rows.map((row, key) => {
      return (
        <tr key={key}>
          <td>
            <div className="matrix-header">
              <span>{row.label}</span>
            </div>
          </td>
          {row.matrix_questions.map((question, index) => {
            return (
              <td onClick={(e) => this.handleCellClick(question.id)} key={`td-${key}-${index}`}>
                <MatrixCell question={question}
                  words={matrixWords[question.id] || []}
                  selected={activity.selectedMatrixCellId === question.id} />
              </td>
            );
          })}
        </tr>
      );
    });

    let submitButton = () => {
      let popover = (<Popover id="popover-positioned-top" className="es-continue-button-popover">Las preguntas son contestadas solamente en las páginas en inglés.</Popover>);
      let submitText = "Submit";
      if(user.preferred_language == "es") {
        submitText = "Inglés";
        return (
          <OverlayTrigger trigger={['hover', 'focus']}
            placement="top" overlay={popover}>
            <button disabled={responseDisabled}
              className="act-response__submit-btn o-btn-action"
              onClick={() => this.handleSubmit()}>
              {submitText}
            </button>
          </OverlayTrigger>
        );
      } else {
        return (
          <button disabled={responseDisabled}
            className="act-response__submit-btn o-btn-action"
            onClick={() => this.handleSubmit()}>
            {submitText}
          </button>
        );
      }
    };

    return (
      <div className="act-response act-response--matrix">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <p className="act-response__instructions">
            Click on a cell in the matrix below to highlight that
            cell. Then, click on words in the article to fill in
            the active cell. Once you have filled the matrix, you
            can submit your answers.
          </p>
          <div className="act-response__response">
            <table className="matrix-table">
              {headerRow}
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
        {submitButton()}
      </div>
    );
  }

  handleClearClick() {
    const { activity, dispatch } = this.props;
    activity.matrixWords[activity.selectedMatrixCellId].forEach((word)=>{
      jQuery(`.content-element p.ce-marked .ce-word--selected.${word.replace(/[ \.,?!;'")(*&@:%]/g, "_")}`).last().removeClass("ce-word--selected");
    });
    dispatch(ActivityActions.clearMatrixCell(activity.selectedMatrixCellId));
  }

  handleCellClick(cellId) {
    this.props.dispatch(ActivityActions.updateSelectedMatrixCell(cellId));
  }

  handleSubmit() {
    let response = new MatrixResponse(this.props.activity);
    const { user, activity, dispatch } = this.props;
    let monologueCount = activity.monologues.length

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please fill out all of the matrix cells.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
}

class MatrixCell extends React.Component {
  render() {
    const { words, selected } = this.props;

    let className = selected ? 'matrix-cell--selected' : '';
    let cellWords = words.map((w,i) => {return( <span key={`w-${i}`}>{w.replace(/[\.,?!;")(*&@:%]/, "")} </span>);});

    return (
      <div className={`matrix-cell ${className}`}>
        {cellWords}
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(MatrixActivity);
