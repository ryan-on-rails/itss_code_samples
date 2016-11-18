import React, { PropTypes }         from 'react';
import ReactDOM                     from 'react-dom';
import { connect }                  from 'react-redux';
import { OverlayTrigger, Popover }  from 'react-bootstrap';
import * as AdminActions            from '../../../actions/AdminActions';

class CommonAbbreviation extends React.Component {  
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {word: null, is_abbv: false};
  }

  componentDidMount() {
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { dispatch, user, contentLoading, word, sentence_id, article } = this.props;

    let class_name = word.is_abbv ? "is_abbv" : "not_abbv";
    let sym = word.is_abbv ? "-" : "+";
    let symbols = [".",",","!","?",";",":","(",")","=","-"];
    let left_space_symbols = ["(","=","-"];
    var space = left_space_symbols.indexOf(word.content) < 0 ? " " : "";
    if(symbols.indexOf(word.content) >= 0){
      return(<span>{space}{word.content}</span>)
    }

    let popover= (
        <Popover id="common-abbv-popover" className={`common-abbv-popover ${class_name}`} onClick={e => this.handleAbbvClick(e)}>
          <span>{sym} Common Abbreviation</span>
        </Popover>
      );
    return(         
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
        <span className={`word last-word ${class_name}`}>{space}{word.content}</span>
      </OverlayTrigger>
    );
  }


  handleAbbvClick(e) {
    const { dispatch, word, sentence_id, article } = this.props;
    dispatch(AdminActions.toggleWordAbbv(article.id, word.id, sentence_id));
  }

}

// Which props do we want to inject, given the global state?
function select(state) {
  return state;
}

export default connect(select)(CommonAbbreviation);
