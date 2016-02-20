import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

import styles from './Service.module.css';

var ServiceItem = ({component}) => (
    <li className={styles.component}>
        <strong>{component.type}:</strong> {component.name}
    </li>
);

var Service = React.createClass({

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
        var {name, meta, code, components} = this.props.service;

        var {x, y} = meta.position;

        var style = {left: x, top: y};

        var options = {mode: 'javascript'};
        var editor = <Codemirror value={code} onChange={this.updateCode} options={options} />;

        return (
            <div className={styles.service}
                 style={style}
                 onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp}>
                {name}
                <ul>
                    {components.map((component) => <ServiceItem component={component} />)}
                </ul>
            </div>
        );

    }

});

export default Service;
