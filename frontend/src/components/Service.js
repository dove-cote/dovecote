import React, { Component } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import classNames from 'classnames';

import styles from './Service.module.css';
import Icon from './Icon';

var ServiceItem = ({component}) => (
    <li className={styles.component}>
        <Icon icon={component.type} /> 
        <div className={styles.componentLabel}>{component.name}</div>
    </li>
);

var Service = React.createClass({

    getInitialState() {
        return {
            edit: false,
            isCurrent: false
        };
    },


    toggleEdit() {
        this.setState({edit: !this.state.edit});
    },

    updateCode() {
        console.log('updating code');
    },

    onMouseOver(event) {
        this.setState({
            isCurrent: true
        });

        this.props.onMouseOver(event);
    },

    onMouseOut(event) {
        this.setState({
            isCurrent: false
        });
        
    },

    render() {
        var {name, meta, code, components} = this.props.service;

        var {x, y} = meta.position;

        var style = {left: x, top: y};

        var options = {mode: 'javascript'};
        var editor = <Codemirror value={code} onChange={this.updateCode} options={options} />;

        let showPlaceholder = (
            components.length > 0 && this.props.isTarget
        );

        return (
            <div className={classNames({
                [styles.service]: true,
                [styles.currentService]: this.state.isCurrent
            })}
                 style={style}
                 onMouseOver={this.onMouseOver}
                 onMouseOut={this.onMouseOut}
                 onMouseLeave={this.props.onMouseLeave}
                 onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp}>
                {name}
                <ul className={styles.componentList}>
                    {components.map((component, index) => <ServiceItem key={index} 
                                                                       component={component} />)}
                    {showPlaceholder && (
                        <div className={styles.componentPlaceholder}></div>
                    )}
                </ul>
                {!components.length && (
                    <div className={styles.empty}>
                        You should drop a component
                        to here.
                    </div>
                )}
            </div>
        );

    }

});

export default Service;
