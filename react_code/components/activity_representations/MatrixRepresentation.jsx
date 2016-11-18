import React, { PropTypes } from 'react';

export default class MatrixRepresentation extends React.Component {
  static propTypes = {
    representation: PropTypes.any.isRequired
  };

  render() {
    const { representation } = this.props;
    let headers = representation.answer[0];

    let colHeaders = headers.map((column, key) => {
      if(column === "") return(<th key={key}></th>);

      return (
        <th key={key}>
          <div className="matrix-header">
            <span>{column}</span>
          </div>
        </th>
      );
    });

    let headerRow = (<thead><tr>{colHeaders}</tr></thead>);
    let rows = representation.answer.map((row, key) => {
      if(key === 0) { return; }

      return (
        <tr key={`feedback_matrix-${key}`}>
          {row.map((cell, index) => {
            return (
              <td key={`cell-${key}-${index}`}>
                <MatrixCell words={cell || [""]}
                  header={index === 0} />
              </td>
            );
          })}
        </tr>
      );
    });

    return (
      <div className="act-representation act-representation--matrix">
        <div className="act-representation__item">
          <table className="matrix-table">
            {headerRow}
            <tbody>
               {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class MatrixCell extends React.Component {
  render() {
    let { words, header } = this.props;
    let className = '';
    let content;

    if(header) {
      content = (<span>{words}</span>);
      className = 'matrix-header';
    }else {
      content = (<span>{words.join(", ")}</span>);
      className = 'matrix-cell';
    }

    return (
      <div className={className}>
        {content}
      </div>
    );
  }
}
