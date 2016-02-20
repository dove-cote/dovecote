import React from 'react';
import $ from 'jquery';

var Logout = React.createClass({

    componentDidMount() {
        $.ajax({
            url: '/api/users/logout',
            success: function () {
                window.location = '/';
            }

        });
    },
    render() {
        return <div className="">
            logout
        </div>;

    }

});


export default Logout;
