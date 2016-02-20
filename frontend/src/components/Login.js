import React from 'react';
import $ from 'jquery';
import _ from 'lodash';

import { browserHistory } from 'react-router'

var store = require('../store');


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
            url: '/api/users/login',
            data: {email: this.state.email, password: this.state.password},
            success: function () {
                this.setState({inProgress: false, error: false});
                browserHistory.push('/projects');
                window.location = '/projects'; // hack for now to trigger proper user data

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
        return <div className="">

        <form onSubmit={this.submitForm}>

            <input type='email' placeholder='email' onChange={_.partial(this.handleFieldChange, 'email')}/>
            <input type='password' placeholder='Password'  onChange={_.partial(this.handleFieldChange, 'password')}/>
            {this.state.error && <div>An error occurred!!!</div>}

            <button>{this.state.inProgress ? "Please wait..." : "Loginsssss"}</button>
        </form>

        </div>;

    }

});


export default Login;
