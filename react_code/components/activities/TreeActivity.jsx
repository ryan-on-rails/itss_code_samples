import React, { PropTypes }   from 'react';
import { connect }            from 'react-redux';
import linemate               from 'linemate';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import * as ActivityActions   from '../../actions/ActivityActions';
import * as UserActions       from '../../actions/UserActions';
import TreeResponse           from '../../models/responses/TreeResponse';
import * as AnswerUI          from '../activity_representations';

let resizeListeners = [];

class TreeActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      response: new TreeResponse(props.activity),
      showMatrixModal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.drawTreeLines();
  }

  componentDidMount() {
    // Ensure that we redraw connections when the viewport
    // size changes. We collect these listeners so that
    // we can remove them when the component unmounts.
    let listener = () => this.drawTreeLines();
    resizeListeners.push(listener);
    window.addEventListener('resize', listener);

    // Draw node connections
    listener();
  }

  componentWillUnmount() {
    resizeListeners.forEach(l => window.removeEventListener('resize', l));
  }

  render() {
    const { activity, responseDisabled, lesson, user } = this.props;
    if(activity.type != "TreeActivity") {return(<div />);}
    let is_disabled = user.preferred_language != "en";

    const buildMatrixRepresentation = () => {
      let answer = [];
      let l2nodes = activity.root_nodes[0].child_nodes;

      // Create header/body arrays
      answer.push([''])
      l2nodes.forEach((node, i) => {
        answer[0].push(node.en_content)

        node.child_nodes.forEach((l3node, j) => {
          if(!answer[j + 1]) {
            answer.push([l3node.en_content]);
          }

          let words = [""];
          if(l3node.tree_question){
            words = l3node.tree_question.words.map(w => w.content + " ");
          }
          answer[j + 1].push(words);
          l3node.child_nodes.forEach((l4node, t) => {
            if(!answer[j + t + 1]) {
              answer.push([l4node.en_content]);
            }

            let l4words = [""];
            if(l4node.tree_question){
              l4words = l4node.tree_question.words.map(w => w.content + " ");
            }
            answer[j + t + 1].push(l4words);
          });
        });
      });

      return { answer };
    }

    const renderTree = () => {
      const drawNode = (node, innerModifier) => {
        const drawNodeQuestion = () => {
          if(node.question) {
            return (
              <div className="act-tree__node__question">
                <textarea
                  disabled={is_disabled}
                  onChange={(e) => this.handleFieldChange(e, node.tree_question.id)}/>
              </div>
            );
          } else {
            return(<span/>);
          }
        };

        const innerClassName = `act-tree__node__inner
          act-tree__node__inner--${innerModifier}`;

        return (
          <div className="act-tree__node">
            <div className={innerClassName}>
              <div className="act-tree__node__header">
                <span>{node.en_content}</span>
              </div>
              {drawNodeQuestion()}
            </div>
          </div>
        );
      }

      switch(lesson.structure.name) {
        case 'Comparison':
        case 'Cause & Effect':
        case 'Problem & Solution':
          // Comparison trees have a single root node that
          // conveys the parent category of the compared things -
          // e.g., "Elephants" might be the root, with child nodes
          // for the different *types* of elephants being compared
          // (African, Indian, etc.).
          const rootNode = activity.root_nodes[0];

          const drawTreeBranchBranches = (root) => {
            return root.child_nodes.map((node, k) => {
              return drawNode(node, 'l3');
            });
          };

          const drawTreeBranches = () => {
            const childNodes = rootNode.child_nodes;
            const marginRight = 5;
            const width = (100 - ((childNodes.length - 1) * marginRight)) /
              childNodes.length;

            return childNodes.map((node, k) => {
              let style = { width: width + '%', marginRight: marginRight + '%' };

              if(k === childNodes.length - 1) {
                style.marginRight = 0;
              }

              return (
                <div className="act-tree__branch" key={k} style={style}>
                  {drawNode(node, 'l2')}
                  {drawTreeBranchBranches(node)}
                </div>
              );
            });
          };

          return (
            <div className="act-tree act-tree--comparison">
              {drawNode(rootNode, 'root')}
              {drawTreeBranches()}
            </div>
          );
      }
    };

    const renderMatrixReview = () => {
      if(lesson.structure.name === "Comparison" || lesson.structure.name === "Cause & Effect"){
        let matrix_representation = buildMatrixRepresentation();

        return (
          <Modal show={this.state.showMatrixModal} onHide={e => this.hideMatrix(e)}
            dialogClassName={'modal-dialog matrix-review-modal'}>
            <AnswerUI.MatrixRepresentation representation={matrix_representation} />
          </Modal>
        );
      }
      return (<div />);
    }

    let submitButton = (styleOption) => {
      let popover = (<Popover id="popover-positioned-top" className="es-continue-button-popover">Las preguntas son contestadas solamente en las páginas en inglés.</Popover>);
      let submitText = "Submit";
      let style = {};
      if (styleOption.addStyle) {style = {width:"65%", left:"35%"}}
      if(user.preferred_language == "es") {
        submitText = "Inglés";
        return (
          <OverlayTrigger trigger={['hover', 'focus']}
            placement="top" overlay={popover}>
            <button disabled={responseDisabled}
              className="act-response__submit-btn o-btn-action"
              onClick={() => this.handleSubmit()} style={style}>
              {submitText}
            </button>
          </OverlayTrigger>
        );
      } else {
        return (
          <button disabled={responseDisabled}
            className="act-response__submit-btn o-btn-action"
            onClick={() => this.handleSubmit()} style={style}>
            {submitText}
          </button>
        );
      }
    };

    const renderButtons = () => {
      if(lesson.structure.name === "Comparison" || lesson.structure.name === "Cause & Effect"){
        return (
          <div>
            <button className="act-review-matrix-btn" onClick={() => this.showMatrix()}/>
            {submitButton({addStyle:true})}
          </div>
        );
      } else {
        return submitButton({addStyle:false});
      }
    }

    return (
      <div className="act-response act-response--tree">
        <div className="act-response__submission">
          {this.props.alertUI()}
          <p className="act-response__instructions">
            Complete the pattern by filling in the blanks below.
          </p>
          <div className="act-response__question act-response__response">
            {renderTree()}
          </div>
        </div>
        {renderMatrixReview()}
        {renderButtons()}
      </div>
    );
  }

  drawTreeLines() {
    const { activity, lesson } = this.props;
    let drawLines;

    // Set some common defaults
    linemate.defaults({ zIndex: 0, color: '#555', width: 5 });
    linemate.confine('.act-tree');

    // Our strategy for drawing the tree node connections (branches)
    // must be specific to the lesson structure
    switch(lesson.structure.name) {
      case 'Comparison':
        drawLines = () => {
          let rootSelector = ".act-tree__node__inner--root";
          let l2selector = ".act-tree__node__inner--l2";
          let l3selector = ".act-tree__node__inner--l3";

          let rootNode = document.querySelector(rootSelector);
          let l2nodes = Array.from(document.querySelectorAll(l2selector));

          l2nodes.forEach(l2node => {
            let l2parent = l2node.parentNode.parentNode;
            let l3nodes = Array.from(l2parent.querySelectorAll(l3selector));

            // Connect root node to L2 nodes
            linemate.connect([rootNode, l2node], { zIndex: 0 });

            l3nodes.forEach(l3node => {
              // Connect L2 node to L3 nodes
              linemate.connect([l2node, l3node], {
                path: 'square-h',
                exitPoint: 'bottomLeft',
                entryPoint: 'left',
                width: 5
              });
            });
          });
        }
        break;
      case 'Cause & Effect':
      case 'Problem & Solution':
        drawLines = () => {
          let rootSelector = ".act-tree__node__inner--root";
          let l2selector = ".act-tree__node__inner--l2";
          let l3selector = ".act-tree__node__inner--l3";

          let rootNode = document.querySelector(rootSelector);
          let l2nodes = Array.from(document.querySelectorAll(l2selector));

          l2nodes.forEach(l2node => {
            let l2parent = l2node.parentNode.parentNode;
            let l3nodes = Array.from(l2parent.querySelectorAll(l3selector));

            // Connect root node to L2 nodes
            linemate.connect([rootNode, l2node], { zIndex: 0 });

            l3nodes.forEach(l3node => {
              // Connect L2 node to L3 nodes
              linemate.connect([l2node, l3node], {
                path: 'square-h',
                exitPoint: 'bottomLeft',
                entryPoint: 'left',
                width: 5
              });
            });
          });
        }
        break;
      default:
    }

    // Clear any existing canvases and draw lines
    linemate.clear();
    drawLines();
  }

  handleFieldChange(e, questionId) {
    let response = this.state.response;
    response.answers.forEach((ans, i) => {
      if(ans.tree_question_id === questionId) {
        response.answers[i].content = e.target.value;
        this.setState({ response: response });
      }
    });
  }


  handleSubmit() {
    let { response } = this.state;
    const { user, activity, dispatch } = this.props;
    let monologueCount = activity.monologues.length;

    if(user.preferred_language != "en" && monologueCount !== 0){
      dispatch(ActivityActions.setNextInstruction(false));
      dispatch(UserActions.setMonologueReplay({replay:true, language:"en"}));
    } else if(user.preferred_language != "en" && monologueCount === 0) {
      dispatch(UserActions.setPreferredLanguage("en"));
    } else if(response.isValid()) {
      this.props.onSubmit(response);
    } else {
      let message = 'Please fill in all of the blanks.';
      this.props.dispatch(ActivityActions.showAlert(message));
    }
  }

  showMatrix(e) {
    this.setState({ showMatrixModal: true });
  }

  hideMatrix(e) {
    this.setState({ showMatrixModal: false });
  }
}

function select(state) {
  return state;
}

export default connect(select)(TreeActivity);
