import React, { PropTypes } from 'react'

class MainIdeaData extends React.Component {
  static propTypes = {
    questions: PropTypes.array.isRequired
  }

  identifier(question) {
    return `${question.lesson_title} (Page ${question.page_position}, Activity ${question.activity_position})`
  }

  tries(count) {
    return ( count === 1 ) ? 'Try' : 'Tries'
  }

  render() {
    const questions = this.props.questions

    return (
      <div className="report-row-data report-main-idea">
        <div className="report-row-section questions">
          {questions.map((question, i) => {
            return (
              <ul key={i} className="leading-row">
                <li className="question-id">{this.identifier(question.question_location)}</li>
                <li className="question-attempts"><span className="report-turq">{question.num_tries}</span> {this.tries(question.num_tries)}</li>
                <li>Scores = {question.main_idea_scores.join(', ')}</li>
              </ul>
            )
          })}
        </div>
      </div>
    )
  }
}

export default MainIdeaData
