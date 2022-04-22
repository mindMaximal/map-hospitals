import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

export default class CustomScrollbars extends Component {

  constructor(props, ...rest) {
    super(props, ...rest);
    this.renderThumb = this.renderThumb.bind(this);
    this.renderTrack = this.renderTrack.bind(this);
    this.onScroll = props.onScroll.bind(this)
  }

  renderTrack({ style, ...props }) {
  return (
    <div {...props} style={{ ...style, width: 8}} className="track-vertical"/>
  )
}

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `#aba9a9`
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}/>

    )
  }

  render() {
    return (
        <Scrollbars
          renderThumbHorizontal={this.renderThumb}
          renderThumbVertical={this.renderThumb}
          renderTrackVertical={this.renderTrack}
          onScroll={this.onScroll}
        >
          {this.props.children}
        </Scrollbars>
    );
  }
}