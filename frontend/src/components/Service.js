import React, { Component } from 'react';
import _ from 'lodash';

import Portal from 'react-portal';
import AceEditor from 'react-ace';
import classNames from 'classnames';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night';

import styles from './Service.module.css';
import Icon from './Icon';

require('./Service.less');

var ServiceItem = ({component, handleRemove, handleRename}) => (
    <li className={classNames(styles.component, 'service-item', 'cf')}>
      <button className='pure-button remove-service-item' onClick={handleRemove}>X</button>
        <Icon icon={component.type} />
        <div className={classNames('name', styles.componentLabel)} onClick={handleRename}>
          {component.name}
          <button className='pure-button rename' >(rename)</button>
        </div>
    </li>
);

var CodeEditor = ({value, onChange, left, top}) => (
    <Portal closeOnEsc closeOnOutsideClick isOpened={true}>
        <div className={styles.codeEditor}
             style={{left: left + 365, top: top + 13}}>
            <AceEditor
                width={'300px'}
                height={'300px'}
                fontSize={13}
                mode={'javascript'}
                theme="tomorrow_night"
                style={{borderRadius: 5, paddingTop: 5}}
                showGutter={false}
                value={value}
                highlightActiveLine={false}
                onChange={onChange}
                editorProps={{$blockScrolling: Infinity}} />
        </div>
    </Portal>
);

var Service = React.createClass({

    getInitialState() {
        return {
            showEditor: false,
            isCurrent: false
        };
    },


    toggleEdit() {
        this.setState({
            showEditor: !this.state.showEditor
        });
    },

    updateCode(code) {
        //debugger
        console.log("update code called");
        this.props.store.addCode(this.props.projectId, this.props.serviceId, code);
        console.log('updating code');
    },

    handleRemoveService() {
        var shouldRemove = window.confirm('Do you want to remove this service?');
        if (shouldRemove) {
            this.props.store.removeService(this.props.projectId, this.props.serviceId);
        } else {

        }
    },

    handleRenameService() {
        var newName = window.prompt('Enter new name for this service', this.props.service.name);
        if (newName) {
            this.props.store.renameService(this.props.projectId, this.props.serviceId, newName);
        } else {

        }
    },

    handleRemoveServiceItem(componentName) {
        var shouldRemove = window.confirm('Do you want to remove this component?');
        if (shouldRemove) {
        this.props.store.removeComponent(this.props.projectId, this.props.serviceId, componentName);
        }
    },

    handleRenameServiceItem(componentName) {

        var newName = window.prompt('Enter new name for this service', componentName);
        if (newName) {
            this.props.store.renameComponent(this.props.projectId, this.props.serviceId, componentName, newName);
        }
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

        let showPlaceholder = (
            components.length > 0 && this.props.isTarget
        );

        return (
            <div className={classNames('service', {
                [styles.service]: true,
                [styles.currentService]: this.state.isCurrent,

            })}
                 style={style}
                 onMouseOver={this.onMouseOver}
                 onMouseOut={this.onMouseOut}
                 onMouseLeave={this.props.onMouseLeave}
                 onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp}>
      <button className='pure-button remove-service' onClick={this.handleRemoveService}>X</button>

                              {this.state.showEditor && (
                    <CodeEditor value={code}
                                left={x}
                                top={y}
                                onChange={this.updateCode} />
                )}

            <div className='name'  onClick={this.handleRenameService}>
                {name}
                <button className='pure-button rename'>(rename)</button>
                </div>

                <button className='pure-button button-xsmall' onClick={this.toggleEdit} style={{float: 'right'}}>{this.state.showEditor ? "Hide Code" : "Edit Code"}</button>

                <ul className={styles.componentList}>
                    {components.map((component, index) => <ServiceItem key={index}
                                                                       handleRemove={_.partial(this.handleRemoveServiceItem, component.name)}
                                                                       handleRename={_.partial(this.handleRenameServiceItem, component.name)}

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
