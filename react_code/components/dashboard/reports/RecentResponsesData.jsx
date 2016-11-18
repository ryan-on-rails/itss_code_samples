import React, { PropTypes } from 'react'

class RecentResponsesData extends React.Component {
  static propTypes = {
    activity:      PropTypes.object.isRequired,
    modelResponse: PropTypes.array.isRequired,
    responses:     PropTypes.array.isRequired
  }

  render() {
    const activity      = this.props.activity
    const modelResponse = this.props.modelResponse
    const responses     = this.props.responses

    return (
      <div className="report-row-data report-recent-responses">
        <div className="report-row-section question">
          <p className="leading-row">
            Question type: <span className="report-turq">{activity.category}</span>; Total tries so far: <span className="report-turq">{responses.length}</span>
          </p>
          <p className="leading-row">
            Description:
          </p>
          {activity.instructions.label.map((label, i) => {
            return (
              <p key={i}>{label}</p>
            )
          })}
          {(() => {
            if ( activity.instructions.options ) {
              return activity.instructions.options.map((option, i) => {
                return (
                  <p key={i}>{option}</p>
                )
              })
            }
          })()}
        </div>
        <div className="report-row-section response model-response">
          <div className="response-header">
            Model Response - This is an example of what the student should have entered:
          </div>
          {modelResponse.map((answer, i) => {
            if ( Array.isArray(answer) ) {
              return (
                <p key={i} className="response-answer">{answer.join(', ')}</p>
              )
            } else {
              return (
                <p key={i} className="response-answer">{answer}</p>
              )
            }
          })}
        </div>
        {responses.map((response, i) => {
          let timestamp = new Date(response.created_at).toLocaleString('en-US')
          return (
            <div key={i} className="report-row-section response">
              <div className="response-header">
                Try {response.attempt} - <span className="report-turq">{timestamp}</span> -
                Scores -
                Signaling: <span className="report-turq">{response.signal_score}</span>,
                Structure: <span className="report-turq">{response.structure_score}</span>,
                Main Idea: <span className="report-turq">{response.main_idea_score}</span>,
                Detail: <span className="report-turq">{response.detail_score}</span>
              </div>
              {response.content.map((answer, j) => {
                if ( Array.isArray(answer) ) {
                  return (
                    <p key={j} className="response-answer">{answer.join(', ')}</p>
                  )
                } else {
                  return (
                    <p key={j} className="response-answer">{answer}</p>
                  )
                }
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default RecentResponsesData
