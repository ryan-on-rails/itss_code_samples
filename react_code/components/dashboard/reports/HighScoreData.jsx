import React, { PropTypes } from 'react'

class HighScoreData extends React.Component {
  static propTypes = {
    questions: PropTypes.object.isRequired,
    gaming:    PropTypes.object.isRequired
  }

  // round decimals to two places
  format(num) {
    return Math.round(num * 100) / 100
  }

  averageTriesPerQuestion() {
    if ( this.props.questions.total_completed === 0 ) {
      return this.props.questions.total_tries
    } else {
      return this.format(this.props.questions.total_tries/this.props.questions.total_completed)
    }
  }

  questionPercentage(success, total) {
    if ( total === 0 ) {
      return '0%'
    } else {
      return `${this.format(success/total)}%`
    }
  }

  render() {
    const questions = this.props.questions
    const gaming    = this.props.gaming

    return (
      <div className="report-row-data report-high-score">
        <div className="report-row-section questions">
          <ul className="leading-row">
            <li>Total questions completed: <span className="report-turq">{questions.total_completed}</span></li>
            <li>Total tries: <span className="report-turq">{questions.total_tries}</span></li>
            <li>Average # of tries per question: <span className="report-turq">{this.averageTriesPerQuestion()}</span></li>
          </ul>
          <div className="row">
            <div className="col-xs-5">
              Signaling questions completed:&nbsp;
              <span className="report-turq">{questions.signaling.completed}</span>
            </div>
            <div className="col-xs-5">
              High score (above 60) on first try:&nbsp;
              <span className="report-turq">{questions.signaling.first_try_high}</span>&nbsp;
              (<span className="report-turq">{this.questionPercentage(questions.signaling.first_try_high, questions.signaling.completed)}</span>)
            </div>
          </div>
          <div className="row">
            <div className="col-xs-5">
              Structure questions completed:&nbsp;
              <span className="report-turq">{questions.structure.completed}</span>
            </div>
            <div className="col-xs-5">
              High score (above 60) on first try:&nbsp;
              <span className="report-turq">{questions.structure.first_try_high}</span>&nbsp;
              (<span className="report-turq">{this.questionPercentage(questions.structure.first_try_high, questions.structure.completed)}</span>)
            </div>
          </div>
          <div className="row">
            <div className="col-xs-5">
              Main Idea completed:&nbsp;
              <span className="report-turq">{questions.main_idea.completed}</span>
            </div>
            <div className="col-xs-5">
              High score (above 60) on first try:&nbsp;
              <span className="report-turq">{questions.main_idea.first_try_high}</span>&nbsp;
              (<span className="report-turq">{this.questionPercentage(questions.main_idea.first_try_high, questions.main_idea.completed)}</span>)
            </div>
          </div>
          <div className="row">
            <div className="col-xs-5">
              Full recall questions completed:&nbsp;
              <span className="report-turq">{questions.full_recall.completed}</span>
            </div>
            <div className="col-xs-5">
              High score (above 60) on first try:&nbsp;
              <span className="report-turq">{questions.full_recall.first_try_high}</span>&nbsp;
              (<span className="report-turq">{this.questionPercentage(questions.full_recall.first_try_high, questions.full_recall.completed)}</span>)
            </div>
          </div>
        </div>
        <div className="report-row-section gaming">
          <p className="leading-row">
            Gaming was detected in <span className="report-red">{gaming.detected_num_questions}</span>&nbsp;
            (<span className="report-red">{this.questionPercentage(gaming.detected_num_questions, questions.total_completed)}</span>)
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

export default HighScoreData
