import React, { PropTypes }     from 'react';
import { Tabs, Tab }  from 'react-bootstrap';

export default class KeyContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabKey: 1
    };
  }

  render() {
    const { keyItem } = this.props;

    let classStr = `key-content--${keyItem.classNameMod} key-content`;
    let keywords = keyItem.keywords.map(function(word, i) {
      return (
        <div className="key-content__keyword" key={i}>
          <span>{word}</span>
        </div>
      );
    });

    // TODO: Figure out how to provide HTML as Tab
    // 'tab' property.

    return (
      <div className={classStr}>
        <div className="key-content__top">
          <div className="row">
            <div className="col-md-6">
              <img className="key-content__icon" src={keyItem.imagePath} alt={`${keyItem.title} Icon`} />
              <h2 className="key-content__title">{keyItem.title}</h2>
              <p className="key-content--description">{keyItem.description}</p>
            </div>
            <div className="col-md-6">
              <h4 className="key-content__subheading">Main Key Words</h4>
              <div className="key-content__keywords">
                {keywords}
              </div>
            </div>
          </div>
        </div>
        <div className="key-content__bottom" >
          <Tabs activeKey={this.state.tabKey} animation={false} onSelect={key => this.handleTabSelect(key)}>
            <Tab eventKey={0} tabClassName="key-content__tab-changer" title="<" />
            <Tab eventKey={1} title="Main Idea Pattern">
              <div className="key-content__body key-content__body--mip" dangerouslySetInnerHTML={{__html: keyItem.mainIdeaPattern}} />
            </Tab>
            <Tab eventKey={2} title="Example">
              <div className="key-content__body key-content__body--example">{keyItem.example}</div>
            </Tab>
            <Tab eventKey={3} title="Signaling Words">
              <div className="key-content__body key-content__body--sw" dangerouslySetInnerHTML={{__html: keyItem.signalingWords}} />
            </Tab>
            <Tab eventKey={4} title="Pattern for Writing">
              <div className="key-content__body key-content__body--pfw" dangerouslySetInnerHTML={{__html: keyItem.writingPattern}} />
            </Tab>
            <Tab eventKey={100} tabClassName="key-content__tab-changer" title=">" />
          </Tabs>
        </div>
      </div>
    );
  }

  handleTabSelect(key) {
    let currentTab = this.state.tabKey,
        newTab;

    if(key === 0) {
      newTab = Math.max(currentTab - 1, 1);
    } else if(key === 100) {
      newTab = Math.min(currentTab + 1, 4);
    } else {
      newTab = key;
    }

    this.setState({ tabKey: newTab });
  }
}
