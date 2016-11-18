import React, { PropTypes }     from 'react';
import { Modal }                from 'react-bootstrap';
import IntelligentTutor         from './IntelligentTutor';
import marked                   from '../lib/marked';
import LanguagePrefixHelper    from '../helpers/LanguagePrefixHelper';


export default class LessonIntro extends React.Component {
  static propTypes = {
    lesson: PropTypes.any.isRequired,
    show: PropTypes.bool,
    onIntroEnd: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      monologueIndex: 0,
      monologueRead: false,
      show: true
    };
  }

  componentWillReceiveProps(props) {
    // If we detect a new lesson, reset
    // the intro state.
    if(props.lesson.id !== this.props.lesson.id) {
      this.setState({
        monologueIndex: 0,
        monologueRead: false,
        show: props.lesson.monologues.length
      });
    }
  }

  render() {
    const { monologueIndex, monologueRead } = this.state;
    const { monologues } = this.props.lesson;
    const { displayLanguage, user } = this.props;


    if(monologues.length === 0) return (<div></div>);
    let monologue = monologues[monologueIndex];

    let lph = new LanguagePrefixHelper(displayLanguage, monologue)
    monologue.autoPlay = monologueIndex !== 0;
    let getText = () => {
      return { __html: marked(lph.assemble("text"), { sanitize: true }) };
    };

    let btnText = monologueIndex === monologues.length - 1 ?
      'Go to Activity' : 'Continue';
    let btnStyle = {
      display: !monologueRead ? 'none' : ''
    };

    return (
      <Modal show={this.props.show && this.state.show}
        dialogClassName="modal-dialog lesson-intro-modal">
        <div className="lesson-intro">
          <IntelligentTutor monologue={monologue} hasBeenRead={monologueRead}
            onRead={() => this.handleMonologueRead()} displayLanguage={displayLanguage} user={user} />
          <div className="lesson-intro__content">
            <div className="lesson-intro__text" dangerouslySetInnerHTML={getText()} />
            <button className="o-btn-action" style={btnStyle} onClick={(e) => this.handleContinueClick(e)}>
              {btnText}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  handleContinueClick(e) {
    let index = this.state.monologueIndex;
    let { monologues } = this.props.lesson;

    if(index === monologues.length - 1) {
      this.setState({ show: false });
      this.props.onIntroEnd();
    } else {
      if(ENV.production) {
        this.setState({ monologueIndex: index + 1, monologueRead: false });
      } else {
        this.setState({ monologueIndex: index + 1, monologueRead: false });
        // NOTE: Skip to last intro frame in development
        //this.setState({ monologueIndex: monologues.length - 1, monologueRead: false });
      }
    }
  }

  handleMonologueRead(e) {
    this.setState({ monologueRead: true });
  }
}
