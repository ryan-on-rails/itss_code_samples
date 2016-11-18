import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import * as GlobalActions     from '../../../actions/GlobalActions';

class RecallContentElement extends React.Component {
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

    let articleOptions = (articles) => {
      return articles.map((article, index) => {
        return <option key={article.id} value={article.id}>{article.en_title}</option>
      });
    };

    return (
      <div className="form-group clearfix col-md-12">
        <h3 className="content_element-label">Recall Element</h3>
        <a className="delete-button" onClick={this.props.onDeleteContentElementClick}><i className="fa fa-times" aria-hidden="true"></i></a>
        <div>
          <div className="form-group col-md-9">
            <label htmlFor="articleType">Change Your Article</label>
            <select className="form-control"
              name="article"
              id="article"
              onChange={(e) => this.handleArticleSelect(e)}
              value={element.article.id || ""}>
                <option value="">Select Your Article</option>
                {articleOptions(this.props.articles)}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label>
              <input type="checkbox"
                defaultChecked={element.clickable || false}
                name="clickable"
                onClick={e => this.handleToggleCheckboxClick(e)}/>
                &nbsp;&nbsp;Clickable?
            </label>
          </div>

        </div>
        {/*articlePreview(this.state.element.article)*/}
      </div>
    );
  }

  handleArticleSelect(e) {
    let element = this.state.element;
    let id = Number(e.target.value);
    let newArticle = {};

    this.props.articles.map((article) => {
      if (article.id === id) {
        element["article"] = article
        element["article_id"] = article.id
      }
    });
    this.setState({element: element});
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

export default connect(select)(RecallContentElement);
