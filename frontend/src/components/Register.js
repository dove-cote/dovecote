import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { browserHistory } from 'react-router'
import URLS from '../urls';

var Register = React.createClass({

    handleFieldChange(fieldName, e) {
        this.setState({[fieldName]: e.target.value});
    },

    submitForm(e) {
        e.preventDefault();

        if (this.state.inProgress) {
            return;
        }

        this.setState({inProgress: true});

        $.ajax({
            type: 'POST',
            url: URLS.register,
            data: {username: this.state.username, email: this.state.email, password: this.state.password},
            success: function () {
                this.setState({inProgress: false, error: false, errorText: null, registered: true});
                // redirect
                // TODO: we should autologin and redirect to dashboard.
                // browserHistory.push('/login');
            }.bind(this),
            error: function (data) {
debugger
                var errorText = '';

                try {
                    errorText = data.responseJSON.error.message;
                } catch (e) {

                }
                this.setState({inProgress: false, error: true, errorText: errorText});
                console.error('error registering');
            }.bind(this)
        })
    },

    getInitialState() {
        return {email: '', password: '', username: '', error: false, errorText: null, inProgress: false};
    },

    render() {
        if (this.state.registered) {
            <div>Account created. You can now login.</div>;
        }
        return <form className='pure-form pure-form-stacked register-form' onSubmit={this.submitForm}>
            <input type='text' placeholder='username' onChange={_.partial(this.handleFieldChange, 'username')}/>
            <input type='email' placeholder='email' onChange={_.partial(this.handleFieldChange, 'email')}/>
            <input type='password' placeholder='Password'  onChange={_.partial(this.handleFieldChange, 'password')}/>
            {this.state.error && <div className='error'>Unable to complete registration. {this.state.errorText.replace('Error: ', '')}</div>}

            <button className='pure-button pure-button-primary'>{this.state.inProgress ? 'Please wait...' : 'Register'}</button>
        </form>;

    }

});


export default Register;
