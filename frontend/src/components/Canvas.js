import React, { Component } from 'react';
import {default as UUID} from "node-uuid";
import Immutable from 'immutable';

import Service from './Service';
import ComponentDialog from './ComponentDialog';
import EdgeCanvas from './EdgeCanvas';
import styles from './Canvas.module.css';

const {fromJS, Map, List} = Immutable;

var Canvas = React.createClass({
    getInitialState() {
        return {
            isDragging: false,
            draggingObjectIndex: null,
            selectedComponent: null,
            showComponentCreationDialog: false,
            showEdgeCanvas: false,

            startPosition: {}
        };
    },

    componentWillMount() {
        this.componentRefs = {};
    },

    componentDidMount() {
        this.setState({
            showEdgeCanvas: true
        });
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
        if (event.target.classList.contains('connector')) {
            return;
        }

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
            startOffset: startOffset,
            startPosition: client
        });
    },

    getDifference(event) {
        let {startPosition} = this.state;

        let client = this.getMouseCoords(event);

        return {
            x: client.x - startPosition.x,
            y: client.y - startPosition.y
        }
    },

    stopDrag(event) {
        this.setState({
            isDragging: false,
            draggingObjectIndex: null,
            startOffset: {}
        });

        let difference = this.getDifference(event);
        
        if (difference.x || difference.y) {
            this.props.onSync();
            this.props.store.snapshotState();
        }

        this.props.onClearSelection();
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

    createNewComponent({name, isExternal, namespace}) {
        if (name) {
            this.props.store.addComponent(
                this.props.project._id,
                this.state.droppedServiceId,
                {
                    type: this.state.droppedComponent,
                    external: isExternal,
                    name,
                    namespace
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

    onRenderComponent(id, domRef) {
        if (domRef) {
            this.componentRefs[id] = domRef;
        }
    },

    onConnectorDrawingStarted(serviceIndex, componentIndex) {
        let {project} = this.props;

        let componentId = (
            project
                .services[serviceIndex]
                .components[componentIndex]
                ._id
        );
        
        this.setState({
            connectingComponentId: componentId
        });
    },

    serviceAllowingModifications(service) {
        return service.name !== 'Gateway';
    },

    buildEdgeName(source, target) {
        let {store, project} = this.props;
        
        let sourceKey = (
            store
                .getComponentById(project._id, source)
                .get('key')
        );
        
        let targetKey = (
            store
                .getComponentById(project._id, target)
                .get('key')
        );

        return (
            sourceKey
              || targetKey
                 || `Edge-${UUID.v4().substr(5)}`
        );
    },

    onConnectorDropped(droppedComponentId) {
        let {connectingComponentId} = this.state;
        let {store, project} = this.props;
        
        let serviceIndex = (
            store.getServiceIndexByComponentId(
                fromJS(project), 
                droppedComponentId
            )
        );

        let service = project.services[serviceIndex];

        let isAllowed = (
            this.serviceAllowingModifications(service)
        );

        if (droppedComponentId && isAllowed) {
            let edgeName = (
                this.buildEdgeName(connectingComponentId, 
                                   droppedComponentId)
            );

            store.connectComponents(
                project._id,
                connectingComponentId,
                droppedComponentId,
                edgeName
            );
        }

        this.setState({
            connectingComponentId: null
        });
    },

    render() {
        let {project} = this.props;
        return (
            <div className={styles.canvas}
                 ref={(ref) => this.canvasElement = ref}
                 onMouseMove={this.onMouseMove}
                 onMouseUp={this.stopDrag}>

                 {this.state.showEdgeCanvas && 
                    <EdgeCanvas 
                        project={project}
                        store={this.props.store}
                        componentRefs={this.componentRefs} 
                        connectingComponentId={this.state.connectingComponentId}
                        onConnectorDropped={this.onConnectorDropped}
                        services={project.services} />
                 };
                 
                 {project.services.map((service, index) =>
                    <Service 
                        service={service}
                        serviceIndex={index}
                        isTarget={this.state.targetComponent === index}
                        onMouseOver={this.setTargetComponent.bind(this, index)}
                        onMouseLeave={this.clearTargetComponent.bind(this, index)}
                        serviceId={index}
                        store={this.props.store}
                        onRenderComponent={this.onRenderComponent}
                        projectId={this.props.project._id}
                        onMouseUp={this.dropComponent.bind(this, index)}
                        onMouseDown={this.startDrag.bind(this, index)}
                        key={index}
                        onConnectorDrawingStarted={this.onConnectorDrawingStarted} />)}
                {this.state.showComponentCreationDialog && (
                    <ComponentDialog
                        isOpen={this.state.showComponentCreationDialog}
                        onSubmit={this.createNewComponent}
                        onClose={this.toggleState.bind(this, 'showComponentCreationDialog')} />
                )}
            </div>
        );
    }

});

export default Canvas;
