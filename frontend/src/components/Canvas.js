import React, { Component } from 'react';

import Service from './Service';
import styles from './Canvas.module.css';

var Canvas = React.createClass({

    render() {
    	let {project} = this.props;
    	
        return (
        	<div className={styles.canvas}>
	        	{project.services.map(service => <Service data={service} />)}
	        </div>
        );
    }

});

export default Canvas;