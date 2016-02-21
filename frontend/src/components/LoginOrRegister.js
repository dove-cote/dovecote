import React from 'react';

import Login from './Login';
import Register from './Register';

var LoginOrRegister = React.createClass({

    render() {
        return <div className="login-register-wrapper">
            <table>
            <thead>
            <tr><th>Existing Member</th>
            <th>New Member</th></tr>

        </thead>
            <tbody>

            <tr>
            <td><Login/></td>
            <td><Register/></td>
            </tr>
            </tbody>
            </table>
        </div>;

    }

});


export default LoginOrRegister;
