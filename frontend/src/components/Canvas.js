import React, { Component } from 'react';

import ProjectComponent from './ProjectComponent';

var Canvas = React.createClass({

    render() {
        var renderProjectComponent = function (item) {
            return <ProjectComponent data={item} />;
        };

        return <div className="">

        {this.props.data.map(renderProjectComponent)}
            this is the canvas
        </div>;

    }

});

export default Canvas;