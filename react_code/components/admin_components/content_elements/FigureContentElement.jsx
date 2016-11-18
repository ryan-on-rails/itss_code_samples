import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import * as GlobalActions     from '../../../actions/GlobalActions';

class FigureContentElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = { element: {} };
  }

  componentWillMount() {
    this.setState({ element: this.props.element});
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ element: nextProps.element});
  }

  render() {
    const { dispatch } = this.props;
    let element = this.state.element;

    return (
      <div className="form-group clearfix col-md-12">
        <h3 className="content_element-label">Figure Element</h3>
        <a className="delete-button" onClick={this.props.onDeleteContentElementClick}><i className="fa fa-times" aria-hidden="true"></i></a>
        <div>
          <div className="form-group col-md-4">
            <label htmlFor="articleType">Change Your Article</label>
            <select className="form-control"
              name="slug"
              id="slug"
              onChange={(e) => this.handleContentEdit(e)}
              value={element.slug || "structure-table"}>
                <option value="structure-table">Structure Table</option>
                <option value="main-idea-pattern">Main Idea Pattern</option>
                <option value="signaling-words">Signaling Words</option>
                <option value="writing-pattern">Writting Pattern</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="articleType">Change Your Article</label>
            <select className="form-control"
              name="structure_id"
              id="structure_id"
              onChange={(e) => this.handleContentEdit(e)}
              value={element.structure_id || 1}>
                <option value={1}>Comparison</option>
                <option value={2}>Problem & Solution</option>
                <option value={3}>Cause & Effect</option>
            </select>
          </div>
          <div className="form-group col-md-3">
            <label>
              <input type="checkbox"
                defaultChecked={element.clickable || false}
                name="clickable"
                onClick={e => this.handleToggleCheckboxClick(e)}/>
                &nbsp;&nbsp;Clickable?
            </label>
          </div>

        </div>
      </div>
    );
  }
  handleContentEdit(e) {
    let element = this.state.element;
    element[e.target.name] = e.target.value;
    this.setState({ element: element });
  }
  handleToggleCheckboxClick(e) {
    let element = this.state.element;
    element[e.target.name] = !element[e.target.name];
    this.setState({ element: element });
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(FigureContentElement);
