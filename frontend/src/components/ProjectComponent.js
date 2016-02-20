import React, { Component } from 'react';

import styles from './ProjectComponent.module.css';

var ProjectComponent = React.createClass({

    render() {

        var renderComponentChild = function (componentChild) {
            return <div>a child {componentChild.name} {componentChild.type}</div>;
        };

        var {name, meta, code, children} = this.props.data;

        var {x, y} = meta.position;
        
        var style = {left: x, top: y};

        return (
            <div className={styles.projectComponent} style={style}>
                Name: {name}
                Meta:
        {meta.position.x}
        {meta.position.y}
                Code: {code}
                {children.map(renderComponentChild)}
            </div>
        );

    }

});

export default ProjectComponent