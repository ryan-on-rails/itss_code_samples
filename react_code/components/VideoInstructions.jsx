import React, { PropTypes }   from 'react';

//const videoPath = "/assets/Lesson1Student5.webm"; //old
const videoPath = "/media/videos/Lesson1Student5.webm"; 
const mp4Path = "/media/videos/Lesson1Student5.mp4"; 

function getVideo() {
  return document.getElementById('instruction-video');
}

export default class VideoInstructions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoFinished: false,
      videoStarted: false,
      show: true
    };
  }

  componentDidMount() {
    this.playVideo();
  }

  render() {
    const { hideContinue } = this.props;
    const { videoFinished, videoStarted } = this.state;

    let cntBtnStyle = { display: videoFinished && !hideContinue ? 'block' : 'none' };
    let playBtnStyle = { display: videoStarted ? 'none' : 'block' };
    let overlayStyle = { display: (!videoStarted || videoFinished) ? 'block' : 'none' };

    return (
      <div className="video-instructions">
        <div className="video-instructions__video">
          <video id="instruction-video" autoPlay={true} controls={true}>
            <source src={videoPath} type="video/webm"/>
            <source src={mp4Path} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-instructions__overlay" style={overlayStyle} >
          <div className="btn-set">
            <button className="o-btn-video play-img" style={playBtnStyle} onClick={(e) => this.playVideo()} />
            <button className="o-btn-video replay-img" style={cntBtnStyle} onClick={(e) => this.handleReplayClick(true)} />
            <button className="o-btn-video replay" style={cntBtnStyle} onClick={(e) => this.handleReplayClick(true)}>
              Play Again
            </button>
          </div>
        </div>
        <button className="o-btn-action continue" style={cntBtnStyle} onClick={(e) => this.handleContinueClick(e)}>
          Continue
        </button>
      </div>
    );
  }

  handleContinueClick(e) {
    this.props.onContinue();
  }

  playVideo() {
    let video = getVideo();

    this.setState({ videoStarted: true }, () => {
      // Fast-forward
      if(ENV.development) {
        video.currentTime = 490;
      }

      video.play();
    });

    let videoEnded = () => {
      video.removeEventListener('ended', videoEnded);
      this.setState({ videoFinished: true });
    }

    video.addEventListener("ended", videoEnded);
  }

  handleReplayClick() {
    getVideo().currentTime = 0;
    this.setState({ videoFinished: false, videoStarted: false },
      () => this.playVideo());
  }
}