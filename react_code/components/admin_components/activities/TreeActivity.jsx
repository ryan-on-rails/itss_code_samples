import React    from 'react';
import ReactDOM from 'react-dom';
import { connect }            from 'react-redux';
import linemate               from 'linemate';
import { Modal, OverlayTrigger, Popover, Col, Row }   from 'react-bootstrap';
import * as AdminActions      from '../../../actions/AdminActions';
import Monologues             from './../Monologues';

class TreeActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {activity: {}};
  }

  componentWillMount() {
    this.setState({ activity: this.props.activity_object, lesson: this.props.admin.lesson});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ activity: nextProps.activity_object, lesson: nextProps.admin.lesson});
  }
  componentDidMount() {
    let page_id = this.props.page_id;
  }


  render() {
    const { dispatch, user, contentLoading, page_id, admin } = this.props;
    const lesson = this.props.admin.lesson;
    const activity = this.state.activity;


    let categoryDropdown = (activity) => {
      return (
        <div className="form-group col-md-12">
          <label htmlFor="articleType">Select Activity Category</label>
          <select className="form-control"
            name="category"
            id="category"
            onChange={(e) => this.handleCategorySelect(e, activity)}
            value={activity.category || ""}>
            <option value="">Select Your Category Type</option>
            <option value="Main Idea">Main Idea</option>
            <option value="Writing">Writing</option>
            <option value="Recall">Recall</option>
            <option value="Structure">Structure</option>
            <option value="Signaling">Signaling</option>
            <option value="Info">Info</option>
          </select>
        </div>
      );
    };

    const renderTree = () => {
      const drawNode = (node, innerModifier, index) => {
        const drawNodeQuestion = () => {
          if(node.question) {
            return node.tree_question.words.map((word, k) => {
              return (
                <div className="act-tree__node__question"  key={k}>
                  <textarea onChange={(e) => this.handleWordChange(e, word)} value={word.content} />
                </div>
              );
            })
          } else {
            return(<span/>);
          }
        };

        const innerClassName = `act-tree__node__inner
          act-tree__node__inner--${innerModifier}`;

        return (
          <div className="act-tree__node form-group" key={index}>
            <div className={innerClassName}>
              <div className="act-tree__node__header">
                <input type="text" className="form-control"
                  placeholder="Tree Node Topic Text"
                  onChange={(e) => this.handleNodeEdit(e, node)}
                  value={node.en_content || ""} />
              </div>
              {drawNodeQuestion()}
            </div>
          </div>
        );
      }

      const rootNode = activity.root_nodes[0];

      const drawTreeBranchBranches = (root) => {
        return root.child_nodes.map((node, k) => {
          return drawNode(node, 'l3', k);
        });
      };

      const drawTreeBranches = () => {
        const childNodes = rootNode.child_nodes;
        const marginRight = 5;
        const width = (100 - ((childNodes.length - 1) * marginRight)) /
          childNodes.length;

        return childNodes.map((node, k) => {
          let style = { width: width + '%'};

          return (
            <div className="act-tree__branch" key={k} style={style}>
              {drawNode(node, 'l2', k)}
              {drawTreeBranchBranches(node)}
            </div>
          );
        });
      };

      return (
        <div className="act-tree act-tree--comparison">
          {drawNode(rootNode, 'root', 0)}
          <div>
          <button type="button" className="btn btn-primary add-field-button"  onClick={e => this.handleAddBranchClick(e, rootNode)} >
            ADD BRANCH <i className="fa fa-plus pull-right" aria-hidden="true"></i>
          </button>
          &nbsp;&nbsp;
          <button type="button" className="btn btn-primary add-field-button"  onClick={e => this.handleAddNodeClick(e, rootNode)} >
            ADD NODE <i className="fa fa-plus pull-right" aria-hidden="true"></i>
        </button>
          </div>
          {drawTreeBranches()}
        </div>
      );
    };

    return (
      <div className="tree-activity-edit clearfix">
        <h3 className="activity-label">Tree Activity</h3>
        <a className="delete-button" onClick={e => this.handleDeleteActivityClick(e)}><i className="fa fa-times" aria-hidden="true"></i></a>
        <Monologues activity_object={this.state.activity}/>
        <div className="form-group col-md-12">
          <label htmlFor="instructions">Instructions</label>
          <input type="text" className="form-control"
            name="instructions"
            id="instructions"
            placeholder="Instructions"
            onChange={(e) => this.handleInstructionsEdit(e)}
            value={activity.instructions || ""} />
        </div>
        {categoryDropdown(activity)}
        <div className="form-group col-md-12">
          <div className="act-response act-response--tree">
            <div className="act-response__submission">
              <div className="act-response__question act-response__response">
                <h4 className="activity-label">Tree Layout</h4>
                {renderTree()}
              </div>
            </div>
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

  handleDeleteActivityClick(e) {
    const { dispatch } = this.props;
    let activity = this.state.activity;
    let lesson = this.props.admin.lesson
    var r = confirm("Are you sure you want to delete this activity?");
    if(r===true){
      lesson.pages.forEach((page) => {
          page.activities.forEach((a, index) => {
            if (activity.id === null) {
              if (activity.created_at === a.created_at) {
                page.activities.splice(index);
              }
            } else if (activity.id === a .id) {
              page.activities.splice(index);
            }
          });
      });
      this.setState({lesson: lesson});
    }
  }

  handleCategorySelect(e, activity) {
    e.preventDefault();
    activity.category = e.target.value;
    this.setState({activity: activity})
  }

  handleNodeEdit(e, node) {
    let activity = this.state.activity;
    node.en_content = e.target.value;
    if (node.question) {
      node.tree_question.label = e.target.value;
    }
    this.setState({activity: activity});
  }

  handleWordChange(e, word) {
    e.preventDefault();
    let activity = this.state.activity;
    word.content = e.target.value;
    this.setState({activity: activity});
  }

  handleAddBranchClick(e, root) {
    let newNode = {id: null, en_content: "", is_root_node: false, question: false, tree_question: null, child_nodes: []};

    if (root.child_nodes.length > 0) {
      let nodeCount = root.child_nodes[0].child_nodes.length
      for (var i=0; i < nodeCount; i++) {
        newNode.child_nodes.push({id: null, tmpId: i, en_content: "", is_root_node: false, question: true,
          tree_question: {id: null, tmpId: i, label: "", words: [{id: null, tmpId: i, content: ""}]}
        });
      }
    }

    root.child_nodes.push(newNode);
    this.setState({activity: this.state.activity});
  }

  handleAddNodeClick(e, root) {
    if (root.child_nodes.length > 0) {
      root.child_nodes.forEach((node, index) => {
        node.child_nodes.push({id: null, tmpId: index, en_content: "", is_root_node: false, question: true,
          tree_question: {id: null, tmpId: index, label: "", words: [{id: null, tmpId: index, content: ""}]}
        });
      });
    }

    this.setState({activity: this.state.activity});
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(TreeActivity);
