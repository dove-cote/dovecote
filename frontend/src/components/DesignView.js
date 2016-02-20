import React, { Component } from 'react';

import Canvas from './Canvas';
import Palette from './Palette';

import styles from './DesignView.module.css';


var Toolbar = React.createClass({

    render() {
        return (
            <div>
                Add a Service
                Deploy
            </div>
        );

    }

});

var DesignView = React.createClass({

    render() {
        let {store, projectId} = this.props;

        let project = store.getProjectById(projectId);
        let palette = store.getPalette();

        return (
            <div className={styles.designView}>
                <div className={styles.canvasArea}>
                    <Canvas project={project} store={store} />
                </div>
                <div className={styles.paletteArea}>
                    <Palette data={palette} />
                </div>
                <div className={styles.toolbarArea}>
                    <Toolbar />
                </div>
            </div>
        );

    }

});

export default DesignView;