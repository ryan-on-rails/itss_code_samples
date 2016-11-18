import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import { Modal }              from 'react-bootstrap';
import * as AdminActions      from '../../actions/AdminActions';
import * as GlobalActions     from '../../actions/GlobalActions';
import * as ContentElements   from './content_elements';
import * as Activities        from './activities';

class Page extends React.Component {
  static propTypes = {
    page_object: PropTypes.any.isRequired
  };
  constructor(props) {
    super(props);

    this.state = { page: {activities: [], content_elements: []}, showMonologues: false };
  }
  componentDidMount() {
    this.setState({ page: this.props.page_object});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ page: nextProps.page_object});
  }

  render() {
    const { dispatch } = this.props;
    let page = this.state.page;
    let activities_view = (page) => {
      return page.activities.map((activity, index)=>{
        switch(activity.type) {
          case 'InfoActivity':
            return (<Activities.InfoActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'CompositionActivity':
            return (<Activities.CompositionActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'QuestionAnswerActivity':
            return (<Activities.QuestionAnswerActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'MatrixActivity':
            return (<Activities.MatrixActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'FillInBlankActivity':
            return (<Activities.FillInBlankActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'FindAndClickActivity':
            return (<Activities.FindAndClickActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'MultipleChoiceActivity':
            return (<Activities.MultipleChoiceActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          case 'TreeActivity':
            return (<Activities.TreeActivity onDeleteActivityClick={() => this.handleDeleteActivity(index)} page_id={page.id} activity_object={activity} key={`act-${index}-${activity.id}`}/>);
          default:
            return ;
        }
      });
    };

    let content_elements = (page) => {
      if(typeof page.content_elements == "undefined" || page.content_elements == null || page.content_elements.length <= 0){
        return;
      }
      return page.content_elements.map((content_element, index)=>{
        switch(content_element.type) {
          case 'ArticleContentElement':
            return (<ContentElements.ArticleElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`}/>);
          case 'MainIdeaContentElement':
            return (<ContentElements.MainIdeaContentElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`}/>);
          case 'RecallContentElement':
            return (<ContentElements.RecallContentElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`}/>);
          case 'RichTextContentElement':
            return (<ContentElements.RichTextContentElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`}/>);
          case 'FigureContentElement':
            return (<ContentElements.FigureContentElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`} />);
          case 'MediaContentElement':
            return (<ContentElements.MediaContentElement onDeleteContentElementClick={() => this.handleDeleteContentElement(index)} element={content_element} key={`ce-${index}-${content_element.id}`} />);
          // case 'AnswerContentElement':
          //   return (<CE.Answer element={el} activity={activity} key={key} />);
          // case 'MediaContentElement':
          //   return (<CE.Media element={el} activity={activity} key={key} />);
          default:
            return ;
        }
      });
    };

    let pageTitle = (page) => {
      if(!page.activities || page.activities.length == 0){
        return(
          <div>
            No Activities
          </div>
        );
      }
      return page.activities.map((activity, index) => {
        return (
          <div key={`act-title-${index}-${activity.id}`}>
            {activity.instructions} ({this.activityTypeFormat(activity.type)})
          </div>
        );
      });
    };

    let contentElementDropdown = (page) => {
      return (
        <div className="form-group col-md-12">
          <label htmlFor="articleType">Add Content Element</label>
          <select className="form-control"
            name="articleType"
            id="articleType"
            onChange={(e) => this.handleAddContentElement(e)}
            value="">
              <option value="">Select Your Content Element Type</option>
              <option value="ArticleContentElement">Article</option>
              <option value="FigureContentElement">Figure</option>
              <option value="MainIdeaContentElement">Main Idea</option>
              <option value="RecallContentElement">Recall</option>
              <option value="MediaContentElement">Media</option>
              {/* TODO: Add the rest of the content element items*/}
              {/*<option value="AnswerContentElement">Answer</option>*/}
              <option value="RichTextContentElement">Custom</option>
          </select>
        </div>
      )
    };

    let activityDropdown = (page) => {
      return (
        <div className="form-group col-md-12">
          <label htmlFor="activityType">Add Activity</label>
          <select className="form-control"
            name="activityType"
            id="activityType"
            onChange={(e) => this.handleAddActivity(e)}
            value="">
              <option value="">Select Your Activity Type</option>
              <option value="InfoActivity">Information</option>
              <option value="MatrixActivity">Matrix</option>
              <option value="FillInBlankActivity">Fill In The Blank</option>
              <option value="FindAndClickActivity">Find and Click</option>
              <option value="CompositionActivity">Composition</option>
              <option value="TreeActivity">Tree</option>
              <option value="QuestionAnswerActivity">Question & Answer</option>
              <option value="MultipleChoiceActivity">Multiple Choice</option>
          </select>
        </div>
      )
    };



    return (
      <div className="panel panel-default overview-panel">
        <div className="panel-heading" role="tab" id={`page${page.id}`}>
          <div className="index-indicator">{this.props.index + 1}</div>
          <h4 className="panel-title course-name">
            <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#page_accordion_${page.id}`} aria-expanded="true" aria-controls={`page_accordion_${page.id}`}>
              {pageTitle(page)}
            </a>
          </h4>
          <a className="delete-button" onClick={e => this.handleDeletePageClick(e)}><i className="fa fa-times" aria-hidden="true"></i></a>
        </div>
        <div id={`page_accordion_${page.id}`} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
          <form className="itss-form col-xs-8 col-xs-offset-2">
            <h3 className="underline">Content Elements:</h3>
            <div className="page-elements">
              {content_elements(page)}
            </div>
            {contentElementDropdown(page)}
            <h3 className="underline">Activities:</h3>
            <div className="page-activities">
              {activities_view(page)}
            </div>
            {activityDropdown(page)}
            <button type="button" className="btn btn-primary save-button-right"  onClick={e => this.handleSavePageClick(e)} >SAVE CHANGES <i className="fa fa-check pull-right" aria-hidden="true"></i></button>
          </form>
          <div className="clearfix"></div>

        </div>
      </div>
    );
  }
  handleDeleteActivity(index){
    const { dispatch } = this.props;
    let page = this.state.page;
    var r = confirm("Are you sure you want to delete this activity?");
    if(r===true){
      page.activities.splice(index, 1);
      this.setState({page: page});
    }

  }
  handleDeleteContentElement(index){
    const { dispatch } = this.props;
    let page = this.state.page;
    var r = confirm("Are you sure you want to delete this content element?");
    if(r===true){
      page.content_elements.splice(index, 1);
      this.setState({page: page});
    }

  }

  handleAddContentElement(e) {
    let newElement = {};
    let page = this.state.page;
    if(typeof page.content_elements == "undefined" || page.content_elements == null){
      page.content_elements = [];
    }
    switch(e.target.value) {
      case 'ArticleContentElement':
        newElement = {type: e.target.value, article: {id: null}, article_id: null, page_id: page.id};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      case 'MainIdeaContentElement':
        newElement = {type: e.target.value, article: {id: null}, article_id: null, page_id: page.id};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      case 'MediaContentElement':
        newElement = {type: e.target.value, article: {id: null}, article_id: null, page_id: page.id};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      case 'RecallContentElement':
        newElement = {type: e.target.value, article: {id: null}, article_id: null, page_id: page.id};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      case 'RichTextContentElement':
        newElement = {type: e.target.value, article_id: null, page_id: page.id, en_content: "", clickable: false};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      case 'FigureContentElement':
        newElement = {type: e.target.value, article_id: null, page_id: page.id, en_content: "", structure_id: 1, clickable: false};
        page.content_elements.push(newElement);
        this.setState({page: page});
        break;
      // case 'AnswerContentElement':
      //   return (<CE.Answer element={el} activity={activity} key={key} />);
      // case 'MediaContentElement':
      //   return (<CE.Media element={el} activity={activity} key={key} />);
      default:
        return;
    }
  }

  handleAddActivity(e) {
    let page = this.state.page;
    let newActivity = null;
     switch(e.target.value) {
      case 'InfoActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: ""};
        break;
      case 'MatrixActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: "", matrix_columns:[], matrix_rows:[]};
        break;
      case 'CompositionActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: "", questions:[]};
        break;
      case 'QuestionAnswerActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: "", question:{}};
        break;
      case 'FindAndClickActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: "", question:{}};
        break;
      case 'FillInBlankActivity':
        newActivity = {type: e.target.value, page_id: page.id, category:"Main Idea", instructions: "", question:{id:null, content:"", fill_in_blank_fields: []}, position: page.activities.length+1};
        break;
      case 'MultipleChoiceActivity':
        newActivity = {type: e.target.value, page_id: page.id, instructions: "Enter your multiple choice activity instructions here.", question:{content:"", id:null, options:[]}};
        break;
      case 'TreeActivity':
        let treeNodes = [
          {
            id: null,
            en_content: "",
            is_root_node: true,
            question: false,
            tree_question: null,
            child_nodes: [
              {
                id: null,
                en_content: "",
                is_root_node: false,
                question: false,
                tree_question: null,
                child_nodes: []
              }
            ]
          }
        ];

        newActivity = {type: e.target.value, page_id: page.id, instructions: "Enter your tree activity instructions here.", root_nodes: treeNodes};
        break;

      default:
        return;
    }
    if(newActivity){
      page.activities.push(newActivity);
      this.setState({page: page});
    }
  }

  handleSavePageClick(e) {
    const { dispatch } = this.props;
    let page = this.state.page;
    dispatch(AdminActions.savePageData(page));
  }

  handleDeletePageClick(e) {
    const { dispatch } = this.props;
    let page = this.state.page;
    var r = confirm("Are you sure you want to delete this page?");
    if(r == true){
      dispatch(AdminActions.deletePage(page));
    }
  }

  activityTypeFormat(type) {
    let typeWordArray = type.split(/(?=[A-Z])/);
    typeWordArray.pop();
    return typeWordArray.join(" ");
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(Page);
