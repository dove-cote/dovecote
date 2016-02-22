import React, { Component } from 'react';
import CircleGraph from './CircleGraph';
import Logging from './Logging';




var MonitorView = React.createClass({

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
