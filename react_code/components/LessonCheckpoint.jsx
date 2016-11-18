import React, { PropTypes }         from 'react';
import { Modal }                    from 'react-bootstrap';

export default class LessonCheckpoint extends React.Component {
  static propTypes = {
    lesson: PropTypes.any.isRequired,
    handleNextActivity:PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      show: true
    };
  }

  render() {
    const { lesson } = this.props;

    return (
      <Modal show={this.state.show && lesson.showCheckpoint } id="checkpoint" onHide={e => {}} dialogClassName={'modal-dialog checkpoint-modal'}>
        <div className="checkpoint__top">
          <img src="/media/other/trophy.png" />
          <h2>Great Job!</h2>
          <div>You've completed {lesson.title}.</div>
        </div>
        <button className="o-btn-action" onClick={() => this.handleButtonClick()}>
          Next Lesson
        </button>
      </Modal>
    );
  }

  handleButtonClick() {
    this.setState({ show: false });
    this.props.handleNextActivity();
  }
}
