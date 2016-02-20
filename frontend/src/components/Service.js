import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

import styles from './Service.module.css';

var ServiceItem = ({data}) => (
    <li><strong>{data.type}:</strong> {data.name}</li>
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
        var {name, meta, code, components} = this.props.data;

        var {x, y} = meta.position;

        var style = {left: x, top: y};

        var options = {mode: 'javascript'};
        var editor = <Codemirror value={code} onChange={this.updateCode} options={options} />;

        return (
            <div className={styles.service} style={style}>
                {name}
                <ul>
                    {components.map((component) => <ServiceItem data={component} />)}
                </ul>
            </div>
        );

    }

});

export default Service;
