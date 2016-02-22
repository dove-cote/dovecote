import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {Graph} from 'graphlib';

import styles from './EdgeCanvas.module.css';

var EdgeCanvas = React.createClass({
    getInitialState() {
        return {
            connectingPoint: {}
        }
    },

    buildGraph(services) {
        let graph = new Graph({
            directed: false
        });
        
        let components = (
            _.flatten(
                _.pluck(
                    services, 'components'
                )
            )
        ).map(
            ({_id, key}) => ({_id, key})
        );

        components.forEach(({_id, key}) => {

            let connected = _.filter(components, (component) => {
                return (
                          component._id !== _id  // avoid self-link
                      &&  component.key          // skip falsy keys
                      &&  component.key === key
                )
            });

            connected.forEach(component => {
                graph.setNode(_id)
                graph.setNode(component._id)
                graph.setEdge(_id, component._id)
            });

        });
        
        return graph;
    },

    getMouseCoords(event) {
        let container = this.canvasElement.getBoundingClientRect();

        return {
            x: event.clientX - container.left,
            y: event.clientY - container.top
        }
    },

    isCollides(x1, y1, x2, y2, radius=20) {
        let xd = x1 - x2;
        let yd = y1 - y2;
        let wt = radius * 2;
        return (xd * xd + yd * yd <= wt * wt);
    },

    getCollidingComponent() {
        let refs = this.props.componentRefs;
        let {connectingPoint} = this.state;

        let x2 = connectingPoint.x,
            y2 = connectingPoint.y;

        let colliding = _.findKey(refs, (value, key) => {
            
            let rect = value.getBoundingClientRect();

            if (
                this.isCollides(
                    rect.left, 
                    rect.top, 
                    x2, 
                    y2
                )
            ) {
                return key;
            }
            
        });

        return colliding;
    },

    onMouseMove(event) {
        let {connectingComponentId} = this.props;

        if (connectingComponentId) {
            let client = this.getMouseCoords(event);
            
            this.setState({
                connectingPoint: client
            });
        }
    },

    onMouseUp() {
        let droppedComponent = this.getCollidingComponent();

        this.props.onConnectorDropped(droppedComponent);

        this.setState({
            connectingPoint: {}
        });
    },

    renameEdge(source, target) {
        let {store, project} = this.props;
        
        let componentKey = (
            store
                .getComponentById(project._id, source)
                .get('key')
        );

        let name = window.prompt(
            'Give a name for that connection.',
            componentKey
        );
        
        store.connectComponents(
            project._id,
            source,
            target,
            name
        );
        
    },

    buildPath(x1, y1, x2, y2) {
        let dx = x1 - x2,
            dy = y1 - y2,
            dr = Math.sqrt(dx * dx + dy * dy);

        return `
            M ${x1}, ${y1}
            A ${dr}, ${dr} 0 0,
            1 ${x2}, ${y2}
        `;
    },

    renderDrawingConnector(componentId) {
        let {connectingComponentId, componentRefs} = this.props;
        let {connectingPoint} = this.state;
        let colliding = this.getCollidingComponent();
        

        let sourceRect = (
            componentRefs[connectingComponentId]
                .getBoundingClientRect()
        );

        let x2 = connectingPoint.x || x1, 
            y2 = connectingPoint.y || y1;

        if (colliding) {
            let collidingRect = (
                componentRefs[colliding]
                    .getBoundingClientRect()
            );

            x2 = collidingRect.left;
            y2 = collidingRect.top;
        }
        
        let x1 = sourceRect.left;
        let y1 = sourceRect.top;

        if (x2 && y2) {
            let d = this.buildPath(x2, y2, x1, y1);
                
            return (
                <path d={d} className={styles.edge} />
            );
        }
    },

    renderLine(source, target) {
        let {componentRefs} = this.props;

        let sourceRef = componentRefs[source];
        let targetRef = componentRefs[target];

        if (!sourceRef || !targetRef) {
            return;
        }
        
        let sourceRect = sourceRef.getBoundingClientRect();
        let targetRect = targetRef.getBoundingClientRect();

        let x1 = sourceRect.left;
        let y1 = sourceRect.top;
        
        let x2 = targetRect.left;
        let y2 = targetRect.top;

        let d = this.buildPath(x1, y1, x2, y2);

        return (
            <path d={d} stroke="black"
                  onClick={this.renameEdge.bind(this, source, target)}
                  className={styles.edge} 
                  key={`${source}-${target}`} />
        )
    },

    render() {
        let {services, connectingComponentId} = this.props;
        let graph = this.buildGraph(services);

        let classes = classNames({
            [styles.canvas]: true,
            [styles.onTop]: !!connectingComponentId
        });

        return (
            <svg className={classes}
                 ref={(ref) => this.canvasElement = ref}
                 onMouseUp={this.onMouseUp}
                 onMouseMove={this.onMouseMove}>
                {
                    graph.edges().map(
                        ({v, w}) => this.renderLine(v, w)
                    )
                }
                {
                    connectingComponentId && (
                        this.renderDrawingConnector(connectingComponentId)
                    )
                }
            </svg>
        );
    }
});

export default EdgeCanvas;