import React, { Component } from 'react';

import Canvas from './Canvas';
import Palette from './Palette';

import styles from './DesignView.module.css';


var Toolbar = React.createClass({

    addService() {
        let name = window.prompt('Service name?', 'My Service');
        if (name) {
            this.props.onAddService(name);
        }
    },

    render() {
        return (
            <div>
                <button onClick={this.addService}>Add a Service</button>
                Deploy
            </div>
        );

    }

});

var DesignView = React.createClass({

    getInitialState() {
        return {
            selectedComponent: null
        };
    },

    addService(name) {
        let {store, projectId} = this.props;
        store.addService(projectId, name);
    },

    selectComponent(componentKey) {
        this.setState({
            selectedComponent: componentKey
        });
    },

    clearSelection() {
        this.setState({
            selectedComponent: null
        });

    },

    render() {
        let {store, projectId} = this.props;
        let {selectedComponent} = this.state;

        let project = store.getProjectById(projectId);
        let palette = store.getPalette();
        
        return (
            <div className={styles.designView}>
                <div className={styles.canvasArea}>
                    <Canvas project={project} 
                            selectedComponent={selectedComponent}
                            onClearSelection={this.clearSelection}
                            store={store} />
                </div>
                <div className={styles.paletteArea}>
                    <Palette data={palette}
                             onClearSelection={this.clearSelection}
                             onComponentSelect={this.selectComponent} />
                </div>
                <div className={styles.toolbarArea}>
                    <Toolbar onAddService={this.addService} />
                </div>
            </div>
        );

    }

});

export default DesignView;