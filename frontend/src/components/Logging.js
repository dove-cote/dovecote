import React, { Component } from 'react';

var Logging = React.createClass({

    getInitialState() {
        return {data: "Lorem ipsum"};
    },

    componentDidMount() {
        this._interval = setInterval(function () {
            $.ajax({
                url: '/api/projects/' + this.props.projectId + '/logs',
                success: function (data) {
                    this.setState({data: String(data)});
                }.bind(this)
            })
        }.bind(this), 5000);
    },

    componentWillUnmount() {
        window.clearInterval(this._interval);
    },

    render() {
        return <div className='pure-u-1-3' style={{overflow: 'scroll'}}>
            <h2>Project Logs</h2>
            <pre>{this.state.data}</pre>
        </div>;

    }

});


export default Logging;
