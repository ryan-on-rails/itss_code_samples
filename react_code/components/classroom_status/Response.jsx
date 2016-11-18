import React, { PropTypes }  from 'react'

// this is acting more like a container but it's a part of the
// ClassroomStatus page so it's "visited" whenever a cell of the
// StudentTable is clicked
class Response extends React.Component {
  static propTypes = {
    timestamp: PropTypes.string,
    answers:   PropTypes.array
  }

  render() {
    let timestamp = ''
    if ( this.props.timestamp ) {
      timestamp = new Date(this.props.timestamp).toLocaleString('en-US')
    }

    return (
      <div id='current-response' className='response'>
        <div id='current-response-timestamp' className='response-timestamp'>
          {timestamp}
        </div>
        {this.props.answers.map((answer, i) => {
          if ( Array.isArray(answer) ) {
            return (
              <p key={i} className='answer'>{answer.join(', ')}</p>
            )
          } else {
            return (
              <p key={i} className='answer'>{answer}</p>
            )
          }
        })}
      </div>
    )
  }
}

export default Response
