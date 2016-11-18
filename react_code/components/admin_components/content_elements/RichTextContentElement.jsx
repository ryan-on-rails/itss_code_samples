import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import * as GlobalActions     from '../../../actions/GlobalActions';

class RichTextContentElement extends React.Component {
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
        <h3 className="content_element-label">Custom Text Element</h3>
        <a className="delete-button"  onClick={this.props.onDeleteContentElementClick}><i className="fa fa-times" aria-hidden="true"></i></a>
        <label>
          <input type="checkbox"
            defaultChecked={element.clickable || false}
            name="clickable"
            onClick={e => this.handleToggleCheckboxClick(e)}/>
            &nbsp;&nbsp;Clickable?
        </label>
        <div className="form-group">
          <label htmlFor="contentPreview">Custom Content:</label>
          <textarea className="form-control content-textarea"
            name="en_content"
            id="en_content"
            placeholder="Content Preview"
            onChange={(e) => this.handleContentEdit(e)}
            value={element.en_content || ""}
           />
        </div>
        <div className="form-group">
          <label htmlFor="contentPreview">Custom Spanish Content:</label>
          <textarea className="form-control content-textarea"
            name="es_content"
            id="es_content"
            placeholder="Content Preview"
            onChange={(e) => this.handleContentEdit(e)}
            value={element.es_content || ""}
           />
        </div>
      </div>
    );
  }

  handleToggleCheckboxClick(e) {
    let element = this.state.element;
    element[e.target.name] = !element[e.target.name];
    this.setState({ element: element });
  }

  handleContentEdit(e) {
    let element = this.state.element;
    element[e.target.name] = e.target.value;
    this.setState({ element: element });
  }


}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(RichTextContentElement);
