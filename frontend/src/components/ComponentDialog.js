import React, { Component } from 'react';
import PromptDialog from './PromptDialog';

var ComponentDialog = React.createClass({
	getInitialState() {
		return {
			isExternal: false,
			namespace: null,
			name: null
		};
	},

	componentWillMount() {
		let {component} = this.props;
		if (component) {
			this.setState({
				name: component.name,
				isExternal: component.external,
				namespace: component.namespace
			});
		}
	},

	onSubmit(receivedName) {
		let {isExternal, namespace, name: defaultValue} = this.state;
		
		this.props.onSubmit({
			name: receivedName || defaultValue,
			isExternal,
			namespace
		});
	},

	onNamespaceChange(event) {
		this.setState({
			namespace: event.target.value
		});
	},

	toggleExternalValue(event) {
		this.setState({
			isExternal: !this.state.isExternal
		});
	},

    render() {
    	let {isExternal, namespace} = this.state;
        return (
			<PromptDialog
				height={isExternal? 170: 140}
				title="Enter a component name"
				default={this.state.name}
				isOpen={this.props.isOpen}
				onClose={this.props.onClose}
				onSubmit={this.onSubmit}>
				<label style={{paddingTop: 10, display: 'block'}}>
					Is external?
					<input type="checkbox"
					   style={{marginLeft: 5}}
					   checked={isExternal}
					   onChange={this.toggleExternalValue} />
				</label>
				
				<label style={{paddingTop: 5, 
					           display: 'block'}}>
					{isExternal && (
						<input type="text"
						   onChange={this.onNamespaceChange}
						   placeholder={'Namespace'}
						   value={namespace} />
					)}
				</label>
			</PromptDialog>
      );
    }
});

export default ComponentDialog;
