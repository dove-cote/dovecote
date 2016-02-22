import React from 'react';
import $ from 'jquery';
import URLS from '../urls';

var Logout = React.createClass({

    componentDidMount() {
        $.ajax({
            url: URLS.logout,
            success: function () {
                window.location = '/';
            }

        });
    },
    render() {
        return <div className="">
            Please wait... Logging out
        </div>;

    }

});


export default Logout;
