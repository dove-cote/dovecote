import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { browserHistory } from 'react-router'

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
            url: '/api/users/register',
            data: {username: this.state.username, email: this.state.email, password: this.state.password},
            success: function () {
                this.setState({inProgress: false, error: false});
                // redirect
                // TODO: we should autologin and redirect to dashboard.
                browserHistory.push('/login');
            }.bind(this),
            error: function () {
                this.setState({inProgress: false, error: true});
                console.error('error registering');
            }.bind(this)
        })
    },

    getInitialState() {
        return {email: '', password: '', username: '', error: false, inProgress: false};
    },

    render() {
        return <div className="">

        <form onSubmit={this.submitForm}>
            <input type='username' placeholder='username' onChange={_.partial(this.handleFieldChange, 'username')}/>
            <input type='email' placeholder='email' onChange={_.partial(this.handleFieldChange, 'email')}/>
            <input type='password' placeholder='Password'  onChange={_.partial(this.handleFieldChange, 'password')}/>
            {this.state.error && <div>An error occurred</div>}

            <button>{this.state.inProgress ? "Please wait..." : "Registersssssfsdfsd"}</button>
        </form>

        </div>;

    }

});


export default Register;
