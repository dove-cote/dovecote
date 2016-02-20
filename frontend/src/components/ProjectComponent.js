import React, { Component } from 'react';

import styles from './ProjectComponent.module.css';
import Codemirror from 'react-codemirror';

require('codemirror/mode/javascript/javascript');

var ProjectComponent = React.createClass({

    getInitialState() {

        return {edit: false};
    },


    toggleEdit() {
        this.setState({edit: !this.state.edit});

    },

    updateCode() {
        console.log('updating code');

    },
    render() {

        var renderComponentChild = function (componentChild) {
            return <div>a child {componentChild.name} {componentChild.type}</div>;
        };

        var {name, meta, code, children} = this.props.data;

        var {x, y} = meta.position;

        var style = {left: x, top: y};

        var options = {mode: 'javascript'};
        var editor = <Codemirror value={code} onChange={this.updateCode} options={options} />;

        return (
            <div className={styles.projectComponent} style={style}>
                Name: {name}
                Meta:
        {meta.position.x}
        {meta.position.y}
                Code: {code}
                {children.map(renderComponentChild)}
                <button onClick={this.toggleEdit}>Edit</button>

                {this.state.edit && editor}
            </div>
        );

    }

});

export default ProjectComponent
