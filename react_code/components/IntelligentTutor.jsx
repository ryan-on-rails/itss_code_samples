import React, { PropTypes }                 from 'react';
import ReactDOM                             from 'react-dom';
import * as ITConstants                     from '../constants/ITConstants';
import { drawImageCover, getSharpCanvas }   from '../lib/CanvasUtils';
import LanguagePrefixHelper                 from '../helpers/LanguagePrefixHelper';

// Pre-load images
let frames = ITConstants.visemeFrames;
let itImages = {};

for(let index in frames) {
  let img = new Image();
  //img.src = `/assets/it/frames/talking-head_${frames[index]}.png`;//old
  img.src = `/media/it/frames/talking-head_${frames[index]}.png`;
  itImages[index] = img;
}

export default class IntelligentTutor extends React.Component {
  static propTypes = {
    hasBeenRead: PropTypes.bool,
    onRead: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      frame: 0,
      playing: false
    };
  }

  componentWillReceiveProps(props) {
    const { monologue, displayLanguage, user } = props;

    // Guard against same monologue.
    if(this.props.monologue && monologue &&
      monologue.id === this.props.monologue.id && !this.props.user.replay_monologue) {
      return;
    }

    this.handleNewMonologue(props);
    if (this.props.user.replay_monologue){ this.replay(props); }
  }

  componentDidMount() {
    this.handleNewMonologue();

    let canvas = ReactDOM.findDOMNode(this).querySelector('canvas');
    let context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    let parentEl = canvas.parentElement;

    // Ensure that canvas is 'sharp': scaled and resized for
    // pixel ratio
    getSharpCanvas(context, parentEl)
    window.addEventListener('resize', () => getSharpCanvas(context, parentEl));

    this.setState({ canvas: canvas, context: context });
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  render() {
    let { hasBeenRead, monologue, displayLanguage } = this.props;


    // When animation is not playing, display a static background image
    let backgroundImg = this.getBackgroundImgPath(0);
    let compStyle = {
      display: this.props.audioOnly ? 'none' : 'block',
      backgroundImage: this.state.playing ? '' : `url('${backgroundImg}')`
    };
    let aText = hasBeenRead ? 'Play Again' : 'Play';
    if (displayLanguage === "es"){
      aText = hasBeenRead ? 'Reproducir de nuevo' : 'Reproducir';
    }
    let aStyle = {
      visibility: this.state.playing ||
                  !this.state.audio ||
                  (!hasBeenRead && monologue && monologue.autoPlay) ? 'hidden' : ''
    };

    return (
      <div style={compStyle} className="act-it">
        <canvas></canvas>
        <a href="javascript:void(0)" style={aStyle}
          className="act-it__play" onClick={(e) => this.play()}>{aText}</a>
      </div>
    );
  }

  getBackgroundImgPath(frame) {
    //const baseImgPath = '/assets/it/frames/talking-head_';
    const baseImgPath = '/media/it/frames/talking-head_';
    return baseImgPath + `${ITConstants.visemeFrames[frame]}.png`;
  }

  play() {
    $(".language-selector").hide()
    if(this.state.playing) { return; }

    const { monologue, displayLanguage } = this.props;
    const offsetFactor = 2.5;
    let frameData = {};
    let elapsed = 0;
    let lph = new LanguagePrefixHelper(displayLanguage, monologue)

    // Create a frameData object by indexing viseme frames
    // by an offsetFactor-adjusted timeOffset marker.
    lph.assemble("viseme_data").forEach(({ timeOffset, visemeValue }) => {
      frameData[Math.floor(timeOffset * offsetFactor)] = visemeValue;
    });

    let lastFrameMarker = +Object.keys(frameData).slice(-1) || 0;

    let animate = (time) => {
      if(!this.state.playing) { return; }
      requestAnimationFrame(animate);

      // Increment frames elapsed
      elapsed += 1;

      // If we find a position marker, draw the corresponding frame
      if(frameData[elapsed] !== undefined) {
        this.drawCanvasImg(frameData[elapsed]);

        // When we reach the last frame marker, reflect
        // that the animation is no longer in progress and
        // clear the canvas
        if(elapsed >= lastFrameMarker) {
          setTimeout(() => {
            this.props.onRead();
            this.stopAnimation();
          }, 1000);
        }
      }
    }

    // Start the audio and animation
    this.drawCanvasImg(0);
    this.setState({ playing: true }, () => {
      let { audio } = this.state;

      let onCanPlayThrough = () => {
        audio.removeEventListener('canplaythrough', onCanPlayThrough);
        audio.play();
        animate();
      }

      audio.load();
      audio.addEventListener('canplaythrough', onCanPlayThrough);

      let audioEnded = () => {
        audio.removeEventListener('ended', audioEnded);
        this.props.onRead();
        this.stopAnimation();
      }

      /*
      // NOTE: End animation in development.
      // NOTE: This causes some unexpected behavior; commenting
      // out for now.
      if(ENV.development) {
        audio.addEventListener("ended", audioEnded);
      }
      */
    });
  }

  replay(props) {
    this.props = props;
    this.play()
    delete this.props.user.replay_monologue;
  }

  drawCanvasImg(frame) {
    let { canvas, context } = this.state;

    drawImageCover(context, itImages[frame], 0, 0, canvas.width, canvas.height);
  }

  handleNewMonologue(props) {
    const { monologue, hasBeenRead, displayLanguage } = props || this.props;

    let lph = new LanguagePrefixHelper(displayLanguage, monologue)

    // Guards
    if(!monologue) { return; }
    if(this.state.audio) { this.stopAnimation(); }
    if(monologue && !lph.assemble("viseme_data") && hasBeenRead) { return; }
    if((!monologue || !lph.assemble("viseme_data")) && !hasBeenRead) {
      return this.props.onRead();
    }

    // Load audio
    let audio = document.createElement('audio');
    audio.src = lph.assemble("audio_path");
    audio.preload = 'auto';

    this.setState({
      audio: audio,
      playing: false
    });

    if(monologue.autoPlay && !hasBeenRead) {
      setTimeout(this.play.bind(this), 500);
    }
  }

  stopAnimation() {
    let { canvas, context } = this.state;

    this.setState({ playing: false });
    this.resetAudio();
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".language-selector").show()
  }

  resetAudio() {
    if(this.state.audio) {
      this.state.audio.pause();
      this.state.audio.currentTime = 0;
    }
  }
}
