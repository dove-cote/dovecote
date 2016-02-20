import React, { Component } from 'react';

import Canvas from './Canvas';
import PromptDialog from './PromptDialog';
import Palette from './Palette';

import styles from './DesignView.module.css';

var Toolbar = React.createClass({
    getInitialState() {
        return {
            showDialog: false
        };
    },

    toggleDialog() {
        this.setState({
            showDialog: !this.state.showDialog
        })
    },

    newService(name) {
        if (name) {
            this.props.onAddService(name);
        }

        this.toggleDialog();
    },

    render() {
        return (
            <div>
                <PromptDialog isOpen={this.state.showDialog}
                              onSubmit={this.newService}
                              onClose={this.toggleDialog}
                              title="Service name?" />
                <button onClick={this.toggleDialog}>Add a Service</button>
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

        this.sync();
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

    sync() {
        let {store, projectId} = this.props;
        let project = store.getProjectById(projectId)
        this.props.onSync(project);
    },

    render() {
        let {store, projectId} = this.props;
        let {selectedComponent} = this.state;

        let project = store.getProjectById(projectId)
        let palette = store.getPalette().toJS();

        if (!project) {
            console.log(projectId, project)
             return <div>Loading</div>;
        } else {
                project = project.toJS();
        }


        return (
            <div className={styles.designView}>
                <div className={styles.canvasArea}>
                    <Canvas project={project}
                            onSync={this.sync}
                            selectedComponent={selectedComponent}
                            onClearSelection={this.clearSelection}
                            store={store} />
                </div>
                <div className={styles.paletteArea}>
                    <Palette data={palette}
                             onUndo={store.undo}
                             onRedo={store.redo}
                             canUndo={store.canUndo()}
                             canRedo={store.canRedo()}
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
