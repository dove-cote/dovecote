import React, { Component } from 'react';
import _ from 'lodash';

import Portal from 'react-portal';
import AceEditor from 'react-ace';
import classNames from 'classnames';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night';

import ComponentDialog from './ComponentDialog';
import styles from './Service.module.css';
import Icon from './Icon';

require('./Service.less');

var ServiceItem = React.createClass({
    getInitialState() {
        return {
            isEditing: false
        };
    },

    toggleState(key) {
        this.setState({
            [key]: !this.state[key]
        });
    },

    render() {
        let {component, onRender, handleRename, handleRemove, allowModifications} = this.props;
        let {_id: id} = component;
        return (
            <li className={classNames(styles.component, 'service-item', 'cf')}
                ref={(ref) => id && onRender(id, ref)}
                onDoubleClick={allowModifications && this.toggleState.bind(this, 'isEditing')}>
                
                {allowModifications && <button className='pure-button remove-service-item' onClick={handleRemove}>X</button>}
                
                <Icon icon={component.type} size={20} />
                
                <div className={classNames('name', styles.componentLabel)}>
                  {component.name}
                </div>
                
                {allowModifications && (
                    <div className={`${styles.connector} connector`}
                     onMouseDown={this.props.onConnectorDrawingStarted} /> 
                )}
                
                {(this.state.isEditing && (
                    <ComponentDialog
                        isOpen={true}
                        type={component.type}
                        component={component}
                        onSubmit={this.props.onUpdateComponent}
                        onClose={this.toggleState.bind(this, 'isEditing')} />
                ))}
            </li>
        );
    }
});

var CodeEditor = React.createClass({

    detectFullScreenChange() {
        if (!document.webkitIsFullScreen) {
            this.props.onClose();
        }
    },

    componentDidMount() {
        document.addEventListener('webkitfullscreenchange', this.detectFullScreenChange, false);
    },

    componentWillUnmount() {
        document.removeEventListener('fullscreenchange', this.detectFullScreenChange);
    },

    render() {

        var {value, onChange, left, top, onClose, fullScreen} = this.props;
        var style, width, height;
        if (fullScreen) {
            style = {top: 0, bottom: 0, left: 0, right: 0};
            width = '100%';
            height = '100%';

        } else {
            style = {left: left + 260, top: top + 56};
            width='650px';
            height='300px';
        }
        // closeOnOutsideClick
        return <Portal closeOnEsc  isOpened={true}   onClose={onClose}>
            <div className={styles.codeEditor}
             style={style}>
            <AceEditor
             width={width}
             height={height}
             fontSize={13}
             mode={'javascript'}
             theme="tomorrow_night"
             style={{borderRadius: 5, paddingTop: 5, top:0, bottom: 0, left:0, right: 0}}
             showGutter={false}
             value={value}
             highlightActiveLine={false}
             onChange={onChange}
             editorProps={{$blockScrolling: Infinity}} />
            </div>
            </Portal>
    }});


var Service = React.createClass({

    getInitialState() {
        return {
            showEditor: false,
            fullScreen: false,
            isCurrent: false
        };
    },


    toggleEdit() {
        this.setState({
            showEditor: !this.state.showEditor
        });
    },

    hideCodeEditor() {

        this.setState({showEditor: false, fullScreen: false});

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
        }
    },

    handleRenameService() {
        var newName = window.prompt('Enter new name for this service', this.props.service.name);
        if (newName) {
            this.props.store.renameService(this.props.projectId, this.props.serviceId, newName);
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


    setFullScreen() {
        try {
            document.documentElement.webkitRequestFullScreen();
        } catch (e) {

        }
        this.setState({fullScreen: true});
    },

    onUpdateComponent(index, serviceIndex,
                     {name, isExternal, namespace}) {
        
        let {projectId} = this.props;

        this.props.store.updateComponent(
            projectId, 
            serviceIndex,
            index,
            {
                name,
                namespace,
                external: isExternal
            }
        );
    },

    renderComponent(component, index) {
        let {serviceIndex, onConnectorDrawingStarted, store} = this.props;

        var allowModifications = this.props.service.name !== 'Gateway';

        let boundOnConnectorDrawingStarted = (
            onConnectorDrawingStarted
                .bind(null, serviceIndex, index)
        );

        return (
            <ServiceItem
                store={store}
                key={index}
                onUpdateComponent={this.onUpdateComponent.bind(this, index, serviceIndex)}
                allowModifications={allowModifications}
                serviceIndex={serviceIndex}
                componentIndex={index}
                handleRemove={_.partial(this.handleRemoveServiceItem, component.name)}
                handleRename={_.partial(this.handleRenameServiceItem, component.name)}
                onRender={this.props.onRenderComponent}
                onConnectorDrawingStarted={boundOnConnectorDrawingStarted}
                component={component} />
        );
    },

    render() {
        var {name, meta, code, components} = this.props.service;
        var {x, y} = meta.position;

        var style = {left: x, top: y};

        let showPlaceholder = (
            components.length > 0 && this.props.isTarget
        );

        let classes = classNames('service', {
            [styles.service]: true,
            [styles.currentService]: this.state.isCurrent
        });

    var allowModifications = name !== 'Gateway';

        return (
            <div className={classes}
                 style={style}
                 onMouseOver={this.onMouseOver}
                 onMouseOut={this.onMouseOut}
                 onMouseLeave={this.props.onMouseLeave}
                 onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp}>


            {allowModifications && <button className='pure-button remove-service' onClick={this.handleRemoveService}>X</button>}

                {this.state.showEditor && <button className='pure-button button-xsmall fullscreen' onClick={this.setFullScreen}><Icon icon='fullscreen' /></button>}
                {this.state.showEditor && (
                    <CodeEditor
                        onChange={this.updateCode}
                      onClose={this.hideCodeEditor}
                      fullScreen={this.state.fullScreen}


                        value={code}
                        left={x}
                        top={y} />
                )}

                <div className={styles.serviceName}
                     onDoubleClick={allowModifications && this.handleRenameService}>
                    {name}
                    {allowModifications && <button className='pure-button button-xsmall'
                                            onClick={this.toggleEdit} style={{float: 'right'}}>
                     {this.state.showEditor ? "Hide Code" : "Edit Code"}
                    </button>}
                </div>

                <ul className={styles.componentList}>
                    {components.map(
                        (component, index) =>
                            this.renderComponent(component, index)
                    )}

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
