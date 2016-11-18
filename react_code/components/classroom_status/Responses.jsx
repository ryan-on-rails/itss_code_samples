import React, { PropTypes }  from 'react'
import { connect }           from 'react-redux'
import * as ResponsesActions from '../../actions/ResponsesActions'
import Response              from './Response'

// this is acting more like a container but it's a part of the
// ClassroomStatus page so it's "visited" whenever a cell of the
// StudentTable is clicked
class Responses extends React.Component {
  static propTypes = {
    loading:         PropTypes.bool,
    errors:          PropTypes.array,
    student:         PropTypes.object.isRequired,
    activity:        PropTypes.object.isRequired,
    responses:       PropTypes.array.isRequired,
    currentResponse: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.changeCurrentResponse = this.changeCurrentResponse.bind(this)
  }

  changeCurrentResponse(attempt) {
    return (event) => {
      // because the response attempt button are re-rendered when the state
      // updates we don't have to add/remove the active class from them,
      // but we do have to worry about the model response button
      if ( attempt === 'model' ) {
        $(event.target).addClass('active')
      } else {
        $('.btn-model').removeClass('active')
      }
      this.props.changeCurrentResponse(attempt)
    }
  }

  render() {
    return (
      <div
        id='student-responses-modal'
        className='modal fade classroom-status-modal'
        tabIndex='-1'
        role='dialog'>
        <article className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='close'>
                <span aria-hidden='true'>&times;</span>
              </button>
              <h1>Question Info and Responses</h1>
            </div>
            {(() => {
              if (this.props.loading) {
                return (
                  <div className='modal-loading'>
                    <div className="itss-loading">
                      <div className="itss-loading__inner">
                        Loading Student Responses...
                      </div>
                    </div>
                  </div>
                )
              }
            })()}
            {(() => {
              if (this.props.errors && this.props.errors.length > 0) {
                return (
                  <div className='modal-error'>
                    {this.props.errors.map((error, i) => {
                      return (
                        <p key={i} className='error'>{error}</p>
                      )
                    })}
                  </div>
                )
              }
            })()}
            <div className='modal-body'>
              <h2>Student:&nbsp;</h2>
              <span className='responses-subtitle'>{this.props.student.first_name} {this.props.student.last_name}</span>
              <section className='activity-article'>
                <h2>Article associated with question</h2>
                <p className="article-title">{this.props.activity.article_title}</p>
                <p>{this.props.activity.article_body}</p>
              </section>
              <section className='activity-question'>
                <h2>Question Description</h2>
                {this.props.activity.instructions.label.map(
                  (instruction, i) => {
                    return (
                      <p key={i} className='question-label'>
                        {instruction}
                      </p>
                    )
                  }
                )}

                {(() => {
                  if (this.props.activity.instructions.options) {
                    return (
                      <ul className='question-options'>
                        {this.props.activity.instructions.options.map(
                          (option, i) => {
                            return (
                              <li key={i}>{option}</li>
                            )
                          }
                        )}
                      </ul>
                    )
                  }
                })()}
              </section>
              <section className='activity-responses'>
                <h2>Responses&nbsp;</h2>
                <p className='responses-description'>Click a number to view student attempts, or click "Model" to view IT's model response.</p>
                <ul className='responses-nav'>
                  {
                    this.props.responses.map((response, i) => {
                      let buttonClass = 'btn-dashboard btn-response'
                      if ( response.id === this.props.currentResponse.id ) {
                        buttonClass = buttonClass + ' active'
                      }

                      return (
                        <li key={response.id}>
                          <button
                            type='button'
                            className={buttonClass}
                            onClick={this.changeCurrentResponse(i)}>
                            {(i+1)}
                          </button>
                        </li>
                      )
                    })
                  }
                  <li className='pull-right'>
                    <button
                      type='button'
                      className='btn-dashboard btn-response btn-model'
                      onClick={this.changeCurrentResponse('model')}>
                      Model
                    </button>
                  </li>
                </ul>
                <Response
                  timestamp={this.props.currentResponse.created_at}
                  answers={this.props.currentResponse.content} />
              </section>
            </div>
          </div>
        </article>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading:   state.dashboard.responses.loading,
    errors:    state.dashboard.responses.errors,
    student:   state.dashboard.responses.student,
    activity:  state.dashboard.responses.activity,
    responses: state.dashboard.responses.responses,
    currentResponse: state.dashboard.responses.currentResponse
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentResponse: (attempt) => {
      dispatch(ResponsesActions.changeCurrentResponse(attempt))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Responses)
