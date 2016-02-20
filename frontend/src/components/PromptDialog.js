import React, { Component } from 'react';
import Modal from 'react-modal';

import styles from './PromptDialog.module.css';

var PromptDialog = React.createClass({
    getInitialState() {
        return {
            text: null
        };
    },

    onSubmit(event) {
        event.preventDefault();
        
        this.props.onSubmit(this.state.text);
        this.props.onClose();
    },

    render() {
        return (
          <Modal
              isOpen={this.props.isOpen}
              onRequestClose={this.props.onClose}
              style={{
                content: {
                    width: 500,
                    height: 110,
                    top: '50%',
                    left: '50%',
                    marginTop: -100,
                    marginLeft: -250
                }
              }}>
            <h1 className={styles.title}>
              {this.props.title}
            </h1>
            <form onSubmit={this.onSubmit}
                  className={styles.form}>
              <input type="text"
                     className={styles.input} 
                     ref={(ref) => this.inputElement = ref}
                     onChange={(e) => this.setState({text: e.target.value})}
                     value={this.state.text} />
               <input type="submit"
                      className={styles.submit}
                      value="Continue" />
            </form>
          </Modal>
      );
    }
});

export default PromptDialog;