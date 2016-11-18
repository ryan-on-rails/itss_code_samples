import React  from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import * as GlobalActions     from '../../actions/GlobalActions';
import { Router, Link }               from 'react-router'

class ArticleOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { articles: [] };
  }

  componentWillMount() {
    this.setState({ articles: this.props.articles});
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ articles: nextProps.articles});
  }

  render() {
    const { dispatch, user, contentLoading, admin } = this.props;
    let articles = this.state.articles;
    let articles_view = (articles) => {
      return articles.map((article, index) => {
        return (
          <div className="article-item-container" key={`article-${index}`}>
            <a className="article-link" href={`#/admin/article/edit/${article.id}`}>
              <div className="article-struct-indicator">{article.structure_name}</div>
              <h3 className="heading">{article.en_title}</h3>
              <div className="clearfix"></div>
            </a>
          </div>
        );
      });
    };

    return (
      <div className="lesson-overview">
        <div className="col-md-12">
          <Link to={`/admin`}className="breadcrumb-link pull-left"><h3 className="heading">Dashboard</h3></Link>
          <span className="breadcrumb-arrow pull-left"><i className="fa fa-chevron-right"></i></span>
          <h3 className="heading pull-left">Article Overview</h3>
        </div>
        
        <Link to={`/admin/article/new`} className="orange-button btn pull-right">ADD ARTICLE +</Link>
        <div className="clearfix"></div>
        <div className="article-list">
          {articles_view(articles)}
        </div>
      </div>
    );
  }

  handleAddArticleClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(AdminActions.resetArticleData());
    this.props.router.push('/admin/article/new');
  }


}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(ArticleOverview);
