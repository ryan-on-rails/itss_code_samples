import React, { PropTypes } from 'react'

class GamingData extends React.Component {
  static propTypes = {
    gaming: PropTypes.object.isRequired
  }

  render() {
    const gaming = this.props.gaming

    return (
      <div className="report-row-data report-high-score">
        <div className="report-row-section gaming">
          <p className="leading-row">
            Gaming was detected in <span className="report-red">{gaming.detected_num_questions}</span>&nbsp;
            questions in <span className="report-red">{gaming.detected_num_tries}</span> separate tries:
          </p>
          <p>Tries with blank responses: <span className="report-red">{gaming.tries.blank_num}</span></p>
          <p>Tries with five or more repeated characters: <span className="report-red">{gaming.tries.repeat_chars_num}</span></p>
          <p>Tries with profanity: <span className="report-red">{gaming.tries.profanity_num}</span></p>
        </div>
      </div>
    )
  }
}

export default GamingData
