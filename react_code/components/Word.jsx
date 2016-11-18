import React, { PropTypes }             from 'react';
import { connect }                      from 'react-redux';
import { OverlayTrigger, Popover }      from 'react-bootstrap';


class Word extends React.Component {
  static propTypes = {
    word: PropTypes.any.isRequired
  };

  render() {
    const { word, translation, user} = this.props;
    let content = typeof word == "string" ? word : word.content;
    if(content == null){return;}
    let content_translation = typeof translation == "string" ? translation : null;
    if(content_translation == null && typeof word == "object" && typeof word.default_translation != "undefined" && word.default_translation != null){ 
      content_translation = word.default_translation.content; 
    }

    let symbols = [".",",","!","?"];
    let class_name = "";
    let space = symbols.indexOf(content) >= 0 ? "" : " ";

    if(content_translation != null && user.is_hybrid ){
      var popover = (<Popover id="popover-positioned-top" className="translation-word">{content_translation}</Popover>);
      return (
        <OverlayTrigger trigger={['hover', 'focus']} 
          placement="top" overlay={popover} >
          <span className={`word has-translation ${class_name}`} >{space}{content}</span>
        </OverlayTrigger> 
      );
    }else{
      return (
        <span className={`word no-translations ${class_name}`} >{space}{content}</span>
      );
    }  
  }
}


function select(state) {
  return state;
}

export default connect(select)(Word);