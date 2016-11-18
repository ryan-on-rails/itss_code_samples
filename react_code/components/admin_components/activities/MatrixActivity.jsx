import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class MatrixActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activity: {matrix_rows: [], matrix_columns: [], num_matrix_rows:2, num_matrix_columns: 2}};
  }

  componentDidMount() {
    let page_id = this.props.page_id;
  }

  componentWillMount() {
    let activity = this.props.activity_object;
    this.setState({ activity: activity});
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    let activity = nextProps.activity_object;
    this.setState({ activity: activity});
  }

  render() {
      const { dispatch, user, contentLoading, page_id, admin } = this.props;
      let activity = this.state.activity;
      var column_header_width = 100/(activity.matrix_columns.length+1);
      let colHeaders = activity.matrix_columns.map((column, key) => {
        return (
          <th key={`col-header-${key}-${column.id}`} style={{width: column_header_width + '%'}}>
            <input type="text" className="form-control matrix_header"
              name="column_header"
              placeholder="Column Label"
              onChange={(e) => this.handleColumnLabelEdit(e, key)}
              value={column.label || ""} />
          </th>
        );
      });
      let rows = activity.matrix_rows.map((row, key) => {
        return (
          <tr key={`matrix-row-${key}-${row.id}`}>
            <td>
              <input type="text" className="form-control matrix_header"
                name="row_header"
                placeholder="Row Label"
                onChange={(e) => this.handleRowLabelEdit(e, key)}
                value={row.label || ""} />
            </td>
            {row.matrix_questions.map((question,q_index) => {
              return (
                <td key={`matrix-question-${q_index}`} >
                  <input type="text" className="form-control"
                    name="matrix_question"
                    placeholder="Answer(s)"
                    onChange={(e) => this.handleWordsEdit(e, key, q_index)}
                    value={question.words_string || ""} />
                    <div className="form-group populate-box">
                      <label>
                        <input type="checkbox"
                          defaultChecked={question.populate || false}
                          name="clickable"
                          onClick={e => this.handleToggleCheckboxClick(e, key, q_index)}/>
                          Populate?
                      </label>
                    </div>
                </td>
              );
            })}
          </tr>
        );
      });
      return (
        <div className="matrix-activity-edit clearfix">
          <h3 className="activity-label">Matrix Activity</h3>
          <a className="delete-button" onClick={this.props.onDeleteActivityClick}><i className="fa fa-times" aria-hidden="true"></i></a>
          <Monologues activity_object={this.state.activity}/>
          <div className="form-group col-md-12">
            <label htmlFor="instructions">Instructions</label>
            <input type="text" className="form-control"
              name="instructions"
              placeholder="Instructions"
              onChange={(e) => this.handleInstructionsEdit(e)}
              value={activity.instructions || ""} />
          </div>
          <div className="form-group clearfix">
            <div className="col-md-2 col-md-offset-4">
              <label htmlFor="num_matrix_rows">Rows</label>
              <input type="number" className="form-control"
                name="num_matrix_rows"
                placeholder="Rows"
                min="1"
                max="5"
                step="1"
                onChange={(e) => this.handleRowUpdate(e)}
                value={activity.matrix_rows.length || 0} />
            </div>
            <div className="col-md-2">
              <label htmlFor="num_matrix_columns">Columns</label>
              <input type="number" className="form-control"
                name="num_matrix_columns"
                placeholder="Columns"
                min="1"
                max="5"
                step="1"
                onChange={(e) => this.handleColumnUpdate(e)}
                value={activity.matrix_columns.length || 0} />
            </div>
          </div>
          <div className="form-group col-md-12 clearfix">
            <div className="act-response__response">
              <table className="matrix-table">
                <tbody>
                  <tr>
                    <th style={{width: column_header_width + '%'}}></th>
                    {colHeaders}
                  </tr>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

  handleInstructionsEdit(e) {
    let activity = this.state.activity;
    activity.instructions = e.target.value;
    this.setState({ activity: activity });
  }
  handleRowLabelEdit(e, index) {
    let activity = this.state.activity;
    activity.matrix_rows[index].label = e.target.value;
    this.setState({ activity: activity });
  }
  handleColumnLabelEdit(e, index) {
    let activity = this.state.activity;
    activity.matrix_columns[index].label = e.target.value;
    this.setState({ activity: activity });
  }

  handleWordsEdit(e, row_index, column_index) {
    let activity = this.state.activity;
    activity.matrix_rows[row_index].matrix_questions[column_index].words_string = e.target.value;
    this.setState({ activity: activity });
  }

  handleToggleCheckboxClick(e, row_index, column_index) {
    let activity = this.state.activity;
    activity.matrix_rows[row_index].matrix_questions[column_index].populate = !activity.matrix_rows[row_index].matrix_questions[column_index].populate;
    this.setState({ activity: activity });
  }

  handleColumnUpdate(e) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    let activity = this.state.activity;
    var value = e.target.value;
    value = value > 5 ? 5 : value;
    value = value < 1 ? 1 : value;
    if(value > activity.matrix_columns.length){
      while(activity.matrix_columns.length < value){
        activity.matrix_columns.push({label: ""});
        activity.matrix_rows.forEach(function(row) {
          row.matrix_questions.push({words:[], words_string:""});
        });
      }
    }else if(value < activity.matrix_columns.length){

      while(activity.matrix_columns.length > value){
        activity.matrix_columns.pop();
        activity.matrix_rows.forEach(function(row) {
          row.matrix_questions.pop();
        });
      }
    }
    this.setState({ activity: activity });

  }
  handleRowUpdate(e) {
    e.preventDefault();
    const { dispatch, state } = this.props;
    let activity = this.state.activity;
    var value = e.target.value;
    if(value === ""){
      return;
    }
    value = value > 5 ? 5 : value;
    value = value < 1 ? 1 : value;
    if(value > activity.matrix_rows.length){
      var questions = [];
      activity.matrix_columns.forEach(function(column) {
        questions.push({words:[], words_string: ""});
      });
      while(activity.matrix_rows.length < value){
        activity.matrix_rows.push({ label: "", matrix_questions: questions});
      }
    }else if(value < activity.matrix_rows.length){
      while(activity.matrix_rows.length > value){
        activity.matrix_rows.pop();
      }
    }
    this.setState({ activity: activity });
  }

  updateActivityOnPage(activity) {
    const { dispatch, state, page_id } = this.props;
    this.props.dispatch(AdminActions.updateActivityOnPage(page_id, activity));
  }

  handleSubmit() {
    const { response } = this.state;

    if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please provide the text you wish to show the student.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }
  handleDeleteActivityClick(e) {
    const { dispatch } = this.props;
    let activity = this.state.activity;
    var r = confirm("Are you sure you want to delete this activity?");
    if(r===true){
      //dispatch(AdminActions.removeActivity(activity.id));
    }
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(MatrixActivity);
