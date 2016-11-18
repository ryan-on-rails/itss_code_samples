import React, { PropTypes }     from 'react';
import { Modal }                from 'react-bootstrap';
import marked                   from '../lib/marked';

export default class MatrixReview extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(props) {
  }

  render() {
    const { activity, level_tree_nodes } = this.props;
    let colHeaders = level_tree_nodes[1].map((column, key) => {
      return (
        <th key={key}>
          <div className="matrix-header">
            <span>{column.en_content}</span>
          </div>
        </th>
      );
    });

    let headerRow = (<thead><tr><th></th>{colHeaders}</tr></thead>);

    // let rows = level_tree_nodes[2].map((row, key) => {
    //   return (
    //     <tr key={key}>
    //       <td>
    //         <div className="matrix-header">
    //           <span>{row.en_content}</span>
    //         </div>
    //       </td>
    //       {row.matrix_questions.map((question) => {
    //         return (
    //           <td onClick={(e) => this.handleCellClick(question.id)}>
    //             <MatrixCell question={question}
    //               words={matrixWords[question.id] || []}
    //               selected={activity.selectedMatrixCellId === question.id} />
    //           </td>
    //         );
    //       })}
    //     </tr>
    //   );
    // });
    let renderMatrix = () => {
      return ( 
        <table className="matrix-table">
        {headerRow}
        </table>
      );
    };

    return (      
      <div className="matrix-review">
        <div className="matrix-review__content">
          {renderMatrix()}
          <button className="o-btn-action" onClick={(e) => this.props.closeModal(e)}>
            Continue
          </button>
        </div>
      </div>
    );
  }
}
