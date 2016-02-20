import React, { Component } from 'react';

import Service from './Service';
import styles from './Canvas.module.css';

var Canvas = React.createClass({

    getInitialState() {
        return {
            isDragging: false,
            draggingObjectIndex: null
        };
    },

    getMouseCoords(event) {
        let container = this.canvasElement.getBoundingClientRect();
        
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
                    x: client.x,
                    y: client.y
                }
            );
        }
    },
    
    startDrag(index) {
        this.setState({
            isDragging: true,
            draggingObjectIndex: index
        });
    },

    stopDrag() {
        this.setState({
            isDragging: false,
            draggingObjectIndex: null
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
                             onMouseDown={this.startDrag.bind(this, index)}/>)}
            </div>
        );
    }

});

export default Canvas;