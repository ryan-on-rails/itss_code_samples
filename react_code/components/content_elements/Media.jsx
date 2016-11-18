import React, { PropTypes } from 'react';
import marked               from '../../lib/marked';

export default class Media extends React.Component {
  static propTypes = {
  };

  render() {
    const { element } = this.props;
    let getMedia = () => {
      if(element.media_is_video){
        return (
          <video width="320" height="240" controls>
            <source src={element.media} type={element.media_content_type}/>
            Your browser does not support the video tag.
          </video>
        );
      }
      else{
       return ( <img className="ce-img" src={element.media}/>);
      }

    }

    return (
      <div className="content-element ce-media">
        {getMedia()}
      </div>
    );
  }
}
