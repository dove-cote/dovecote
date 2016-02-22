import React, { Component } from 'react';
import CircleGraph from './CircleGraph';
import Logging from './Logging';
import $ from 'jquery';



var MonitorView = React.createClass({

    componentDidMount() {
        $('#root').addClass('allowScroll');
    },

    componentWillUnmount() {
        $('#root').removeClass('allowScroll');

    },

	render() {
        return (
        	<div className='pure-g' style={{marginLeft: 20}}>
	            <CircleGraph projectId={this.props.projectId}/>
                <Logging projectId={this.props.projectId}/>
	        </div>
        );

    }

});

export default MonitorView;
