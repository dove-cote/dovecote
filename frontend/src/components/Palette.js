import React, { Component } from 'react';

import Icon from './Icon';
import styles from './Palette.module.css';


var PaletteItem = ({item}) => (
	<div className={styles.paletteItem}>
		<Icon icon={item.type}
			  size={"2em"} />
		<span className={styles.paletteItemName}>
			{item.name}
		</span>
	</div>
);


var Palette = React.createClass({

    render() {
        return (
        	<div className={styles.palette}>
	        	{this.props.data.map(
	        		(item) => <PaletteItem item={item} />)}
	        </div>
        );
    }

});

export default Palette;