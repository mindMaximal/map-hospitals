import React, {Component} from "react"
import {Scrollbars} from "react-custom-scrollbars"

export class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        renderView={props => <div {...props} className="management__scroll-view"/>}>
        {this.props.children}
      </Scrollbars>
    );
  }
}