import React, { Component } from 'react';

var Icon = React.createClass({
  getDefaultProps() {
    return {
      size: 24,
      style: {}
    };
  },
  renderGraphic() {
    switch (this.props.icon) {
      case 'accessibility':
        return (
          <g><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6h-2v-13h-6v-2h18v2z"></path></g>
        );
      case 'req':
        return (
          <g><path d="M20 11h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17v-2z"></path></g>
        );
      case 'res':
        return (
          <g><path d="M12 4l-1.41 1.41 5.58 5.59h-12.17v2h12.17l-5.58 5.59 1.41 1.41 8-8z"></path></g>
        );
      case 'pub':
        return (
          <g><path d="M16 6l2.29 2.29-4.88 4.88-4-4-7.41 7.42 1.41 1.41 6-6 4 4 6.3-6.29 2.29 2.29v-6z"></path></g>
        );
      case 'sub':
        return (
          <g><path d="M16 18l2.29-2.29-4.88-4.88-4 4-7.41-7.42 1.41-1.41 6 6 4-4 6.3 6.29 2.29-2.29v6z"></path></g>
        );
      case 'sockend':
        return (
          <g><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4v-1.9h-4c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9h-4c-1.71 0-3.1-1.39-3.1-3.1zm4.1 1h8v-2h-8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4v1.9h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
        );
    }
  },
  render() {
    let styles = {
      fill: "black",
      verticalAlign: "middle",
      width: this.props.size, // CSS instead of the width attr to support non-pixel units
      height: this.props.size // Prevents scaling issue in IE
    };
    return (
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fit
        style={{
          ...styles,
          ...this.props.style
        }}>
          {this.renderGraphic()}
      </svg>
    );
  }
});

export default Icon;