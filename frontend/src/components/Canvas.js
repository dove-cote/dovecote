import React, { Component } from 'react';

import ProjectComponent from './ProjectComponent';
import styles from './Canvas.module.css';

var Canvas = React.createClass({

    render() {
        var renderProjectComponent = function (item) {
            return <ProjectComponent data={item} />;
        };

        return <div className={styles.canvas}>

        {this.props.data.map(renderProjectComponent)}
            
        </div>;

    }

});

export default Canvas;