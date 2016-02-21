import React, { Component } from 'react';

import Canvas from './Canvas';
import PromptDialog from './PromptDialog';
import Palette from './Palette';

import styles from './DesignView.module.css';
import _ from 'lodash';



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

    toggleDeployDialog() {
        var shouldDeploy = window.confirm('do you want to deploy?');
        if (shouldDeploy) {
            console.log('deploy');
        } else {
            console.log('abort deploy');

        }

    },

    render() {
        return (
            <div className='bottom-toolbar'>
              <PromptDialog isOpen={this.state.showDialog}
                            onSubmit={this.newService}
                            onClose={this.toggleDialog}
                            title="Service name?" />
              <button className='pure-button pure-button-primary' onClick={this.toggleDialog}>+ Add a Service</button>
              <button className='pure-button' style={{marginLeft: 10}} onClick={this.toggleDeployDialog}>Deploy</button>

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
            return <div>Loading</div>;
        }

        project = project.toJS();

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
                         onUndo={_.partial(store.undo, this.sync)}
                         onRedo={_.partial(store.redo, this.sync)}
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
