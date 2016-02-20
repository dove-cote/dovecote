import React, { Component } from 'react';

import Service from './Service';
import PromptDialog from './PromptDialog';
import styles from './Canvas.module.css';

var Canvas = React.createClass({
    getInitialState() {
        return {
            isDragging: false,
            draggingObjectIndex: null,
            startPoint: null,
            selectedComponent: null,
            showComponentCreationDialog: false
        };
    },

    getMouseCoords(event) {
        let container = this.canvasElement.getBoundingClientRect();
        let {startOffset} = this.state;

        return {
            x: event.clientX - container.left,
            y: event.clientY - container.top
        }
    },

    onMouseMove(event) {
        if (this.state.isDragging) {

            // todo: update dom object instantly instead
            // of virtual-dom update

            let client = this.getMouseCoords(event);
            this.props.store.setServicePosition(
                this.props.project._id,
                this.state.draggingObjectIndex,
                {
                    x: client.x - this.state.startOffset.x,
                    y: client.y - this.state.startOffset.y
                }
            );
        }
    },

    startDrag(index, event) {
        let service = this.props.project.services[index];
        let client = this.getMouseCoords(event);

        let startOffset = {
            x: client.x - service.meta.position.x,
            y: client.y - service.meta.position.y,
        };

        this.props.store.snapshotState();

        this.setState({
            isDragging: true,
            draggingObjectIndex: index,
            startOffset: startOffset
        });
    },

    stopDrag() {
        this.setState({
            isDragging: false,
            draggingObjectIndex: null
        });

        this.props.store.snapshotState();
        this.props.onClearSelection();
        this.props.onSync();
    },

    dropComponent(serviceIndex, event) {
        let {selectedComponent} = this.props;

        if (!selectedComponent) {
            return;
        }

        this.setState({
            showComponentCreationDialog: true,
            droppedServiceId: serviceIndex,
            droppedComponent: this.props.selectedComponent
        });
    },

    toggleState(key) {
        this.setState({
            [key]: !this.state[key]
        });
    },

    createNewComponent(name) {
        if (name) {
            this.props.store.addComponent(
                this.props.project._id,
                this.state.droppedServiceId,
                {
                    type: this.state.droppedComponent,
                    name
                }
            );

            this.props.onSync();
        }
    },

    setTargetComponent(key) {
        if (this.props.selectedComponent) {
            this.setState({
                targetComponent: key
            });
        }
    },

    clearTargetComponent(key) {
        this.setState({
            targetComponent: null
        });
    },

    render() {
        let {project} = this.props;
        return (
            <div className={styles.canvas}
                 ref={(ref) => this.canvasElement = ref}
                 onMouseMove={this.onMouseMove}
                 onMouseUp={this.stopDrag}>
                 {project.services.map((service, index) =>
                    <Service service={service}
                                 isTarget={this.state.targetComponent === index}
                                 onMouseOver={this.setTargetComponent.bind(this, index)}
                                 onMouseLeave={this.clearTargetComponent.bind(this, index)}
                                 serviceId={index}
                                 store={this.props.store}
                                 projectId={this.props.project._id}
                                 onMouseUp={this.dropComponent.bind(this, index)}
                             onMouseDown={this.startDrag.bind(this, index)}/>)}
                <PromptDialog
                    title="Enter a component name"
                    isOpen={this.state.showComponentCreationDialog}
                    onSubmit={this.createNewComponent}
                    onClose={this.toggleState.bind(this, 'showComponentCreationDialog')} />
            </div>
        );
    }

});

export default Canvas;
