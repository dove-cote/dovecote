import React, { Component } from 'react';

var Palette = React.createClass({

    render() {
        var renderPaletteItem = function (item) {
            return <div>{item.type} {item.icon}</div>;
        }


        return <div className="">
            this is palette

        {this.props.data.map(renderPaletteItem)}
        </div>;

    }

});

export default Palette;