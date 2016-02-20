import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Icon from './Icon';
import styles from './Palette.module.css';


var PaletteItem = React.createClass({
    updateGhost(element, event) {
        element.style.display = 'block';
        element.style.top = event.clientY  + 'px';
        element.style.left = event.clientX - 50 + 'px';
    },

    removeGhost(element) {
        element.parentNode.removeChild(
            element
        );
    },

    onMouseDown(event) {
        this.props.onComponentSelect(
            this.props.item.type
        );

        let element = ReactDOM.findDOMNode(this);

        let cloned = element.cloneNode(true);

        cloned.classList.add(styles.ghostItem);

        window.document.body.appendChild(
            cloned,
            element.nextSibling
        );

        let ghostUpdateCallback = this.updateGhost.bind(this, cloned);
        let removeGhostCallback = () => {
            window.document.removeEventListener('mousemove', ghostUpdateCallback);
            window.document.removeEventListener('mouseup', removeGhostCallback);

            this.removeGhost(cloned);
        };

        window.document.addEventListener('mousemove', ghostUpdateCallback);
        window.document.addEventListener('mouseup', removeGhostCallback);
    },

    onMouseUp() {
        this.props.onClearSelection();
    },

    render() {
        let {item} = this.props;
        return (
            <div className={styles.paletteItem}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}>
                <Icon icon={item.type}
                      size={"2em"} />
                <span className={styles.paletteItemName}>
                    {item.name}
                </span>
            </div>
        );
    }
});


var Palette = React.createClass({

    render() {
        return (
            <div className={styles.palette}>

              <button onClick={this.props.onUndo} disabled={!this.props.canUndo} style={{fontStyle: this.props.canUndo ? 'normal' : 'italic', color: this.props.canUndo ? 'black' : 'grey'}}>Undo</button>
              <button onClick={this.props.onRedo} disabled={!this.props.canRedo} style={{color: this.props.canRedo ? 'black' : 'grey'}}>Redo</button>



                {this.props.data.map(
                    (item) => (
                        <PaletteItem
                            onClearSelection={this.props.onClearSelection}
                            onComponentSelect={this.props.onComponentSelect}
                            item={item} />
                    ))}
            </div>
        );
    }

});

export default Palette;
