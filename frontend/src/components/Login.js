import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import URLS from '../urls';

import { browserHistory } from 'react-router'

var store = require('../store');

require('./login.less');

var Login = React.createClass({


    handleFieldChange(fieldName, e) {
        this.setState({[fieldName]: e.target.value});
    },

    submitForm(e) {
        e.preventDefault();

        if (this.state.inProgress) {
            return;
        }


        this.setState({inProgress: true});

        var email = this.state.email;
        $.ajax({
            type: 'POST',
            url: URLS.login,
            data: {email: this.state.email, password: this.state.password},
            success: function () {
                this.setState({inProgress: false, error: false});
                browserHistory.push('/projects');
                // window.location = '/projects'; // hack for now to trigger proper user data

            }.bind(this),
            error: function () {

                this.setState({inProgress: false, error: true});
                console.error('error logging in')

            }.bind(this)

        })
    },

    getInitialState() {
        return {email: '', password: '', error: false, inProgress: false};
    },

    render() {
        return <form className='pure-form pure-form-stacked login-form' style={{width: 300}} onSubmit={this.submitForm}>

            <input type='email' placeholder='email' onChange={_.partial(this.handleFieldChange, 'email')}/>
            <input type='password' placeholder='Password'  onChange={_.partial(this.handleFieldChange, 'password')}/>
            {this.state.error && <div className='error'>Not recognized email and password combination</div>}

            <button className='pure-button pure-button-primary' style={{width: '100%'}}>{this.state.inProgress ? "Please wait..." : "Login"}</button>
        </form>;

    }

});


export default Login;
