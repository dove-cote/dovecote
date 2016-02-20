import React, { Component } from 'react';

import Service from './Service';
import styles from './Canvas.module.css';

var Canvas = React.createClass({

    getInitialState() {
        return {
            isDragging: false,
            draggingObjectIndex: null,
            startPoint: null,
            selectedComponent: null
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

        this.props.onClearSelection();
    },

    dropComponent(serviceIndex, event) {
        let {selectedComponent} = this.props;

        if (!selectedComponent) {
            return;
        }

        let name = window.prompt('Component Name?', 'My component');

        if (name) {
            this.props.store.addComponent(
                this.props.project._id,
                serviceIndex,
                {
                    type: this.props.selectedComponent,
                    name
                }
            );
        }
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
                             onMouseUp={this.dropComponent.bind(this, index)}
                             onMouseDown={this.startDrag.bind(this, index)}/>)}
            </div>
        );
    }

});

export default Canvas;