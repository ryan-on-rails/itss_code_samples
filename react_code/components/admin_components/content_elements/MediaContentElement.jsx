import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import * as GlobalActions     from '../../../actions/GlobalActions';

class MediaContentElement extends React.Component {
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
      <div className="form-group clearfix col-md-12 media_element">
        <h3 className="content_element-label">Custom Text Element</h3>
        <a className="delete-button"  onClick={this.props.onDeleteContentElementClick}><i className="fa fa-times" aria-hidden="true"></i></a>
        <div className="form-group">
          <img src={((typeof element.media_url != "undefined" || element.media_url == null) ? element.media_url : "" )} />
          <label>
            <input id="formControlsFile"
              className=""
              type="file"
              label="File"
              accept=".jpg,.jpeg,.png,.gif"
              help="Upload a new File"
              onChange={e => this.handleImageChange(e)}
              />
            <span><i className="fa fa-pencil" aria-hidden="true"></i> Upload New</span>
          </label>
        </div>
      </div>
    );
  }
  handleImageChange(e) {
    var reader = new FileReader();
    let file = e.target.files[0];
    let element = this.state.element;
    element.media = file;
    element.media_is_updated = true;
    element.media_file_name = file.name;

    reader.onloadend = () => {
      element.media_url = reader.result;
      this.setState({ element: element });
    }
    reader.readAsDataURL(file);
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

export default connect(select)(MediaContentElement);
