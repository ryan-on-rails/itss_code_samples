import React, { PropTypes }             from 'react';
import { OverlayTrigger, Popover }      from 'react-bootstrap';
import { ProgressBar as BSProgressBar } from 'react-bootstrap';

// Preload icons
const icons = [
  '/media/activity/signal-words.svg',
  '/media/activity/information.svg',
  '/media/activity/main-idea.svg',
  '/media/activity/structure.svg',
  '/media/activity/recall.svg'
];

icons.forEach(path => {
  let img = new Image();
  img.src = path;
});

export default class ProgressBar extends React.Component {
  static propTypes = {
    lesson: PropTypes.any.isRequired,
    activity: PropTypes.any.isRequired,
    progress: PropTypes.any.isRequired,
    displayLanguage: PropTypes.any.isRequired
  };

  render() {
    const { lesson, activity, progress, displayLanguage } = this.props;

    let activityProgress = () => {
      let actTrackerPO = (act) => {
        let label, className;

        switch(act.category) {
          case 'Signaling':
            label = displayLanguage === 'es' ? 'Palabras Seneladas' : 'Signaling Words' ;
            className = 'act-tracker-po--signaling';
            break;
          case 'Main Idea':
            label = displayLanguage === 'es' ? 'Idea Principal' : 'Main Idea' ;
            className = 'act-tracker-po--mi';
            break;
          case 'Structure':
            label = displayLanguage === 'es' ? 'Structura' : 'Structure' ;
            className = 'act-tracker-po--structure';
            break;
          case 'Recall':
            label = displayLanguage === 'es' ? 'Retirada' : 'Recall' ;
            className = 'act-tracker-po--recall';
            break;
          case 'Info':
            label = displayLanguage === 'es' ? 'Información' : 'Information' ;
            className = 'act-tracker-po--info';
            break;
        }

        return (
          <Popover key={`po-${act.id}`} id={`po-${act.id}`}
            className={`act-tracker-po ${className}`} title=''>
            <span>{label}</span>
          </Popover>
        );
      };

      return lesson.activities.map((act, key) => {
        let className = 'act-progress-dot ';

        if(act.id === activity.id) {
          className += 'act-progress-dot--active ';
        }

        // NOTE: This works, but it's a bit of a hack;
        // we might instead rely on some lesson-level
        // activity position.
        if(act.id < activity.id) {
          className += 'act-progress-dot--done';
        }

        if(act.id === activity.id || act.id < activity.id) {
          return (
            <OverlayTrigger key={`ot-${key}`} rootClose trigger={['hover', 'focus']} placement='top' overlay={actTrackerPO(act)}>
              <a className={className}>
              </a>
            </OverlayTrigger>
          );
        } else {
         return (
            <a key={`a-${key}`} className={className}>
            </a>
          );
        }
      });
    };

    let popover = () => {
      return (
        <Popover id="po-lessons" className="app-progress-bar__popover" title=''>
          {progress.lessons.map((lesson, key) => {
            let bar;
            let class_name = lesson.is_current_lesson ? "current_lesson" : "";
            // >= -> Hack to account for multiple successful submissions
            if(lesson.percentage >= 100) {
              bar = (
                <div className="progress-po-item__complete">
                  Complete
                </div>
              );
            } else {
              bar = (
                <BSProgressBar now={lesson.percentage} className="progress-po-item__bar"
                  label='%(percent)s%' srOnly />
              );
            }

            return (
              <div key={`po-item-${key}`} className="progress-po-item">
                {bar}
                <span className={`progress-po-item__label ${class_name}`}>
                  {lesson.title}
                </span>
              </div>
            );
          })}
        </Popover>
      );
    };

    return (
      <div className="app-progress-bar">
        <a className="app-progress-bar__structure">
          {displayLanguage == "es" ? lesson.structure.es_name : lesson.structure.name}
        </a>
        <OverlayTrigger rootClose trigger='click' placement='top' overlay={popover()}>
          <a className='app-progress-bar__count'>
            {progress.current_lesson} / {progress.total_lessons}
          </a>
        </OverlayTrigger>
        {activityProgress()}
      </div>
    );
  }
}
