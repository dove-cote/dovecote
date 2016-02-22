import React, { Component } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import _ from 'lodash';

import styles from './PromptDialog.module.css';

var PromptDialog = React.createClass({
    getDefaultProps() {
        return {
            width: 500,
            height: 120
        };
    },

    getInitialState() {
        return {
            text: null
        };
    },

    onChange(event) {
        this.setState({text: event.target.value})
    },

    onSubmit(event) {
        event.preventDefault();

        this.props.onSubmit(this.state.text);
        this.props.onClose();

        this.setState({
          text: null
        });
    },

    render() {
        let {height, width} = this.props;
        return (
            <Modal
              isOpen={this.props.isOpen}
              onRequestClose={this.props.onClose}
              style={{
                content: {
                    width,
                    height,
                    top: '50%',
                    left: '50%',
                    marginTop: -(height / 2),
                    marginLeft: -(width / 2)
                }
              }}>
                <h1 className={styles.title}>
                  {this.props.title}
                </h1>
                <form onSubmit={this.onSubmit} className={styles.form}>
                    <input type="text" className={styles.input}
                         ref={(ref) => this.inputElement = ref}
                         onChange={this.onChange} 
                         value={this.state.text || this.props.default} />
                    {this.props.children}
                    <input type="submit"
                           value="Continue"
                           className={cx('pure-button pure-button-primary', styles.submit)} />
                </form>
          </Modal>
      );
    }
});

export default PromptDialog;
