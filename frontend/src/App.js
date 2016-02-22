import React, {Component} from 'react';
import ProjectView from './components/ProjectView';
import {browserHistory} from 'react-router';

import store from './store';
import styles from './App.module.css';

require('./App.less');
require('./components/buttons.less');

import $ from 'jquery';

window.__STORE__ = store;

var UserInfo = React.createClass({
    render() {
        var {email, username} = this.props.user;
        return (
          <div>
            {username ?
              <div>{username} <a href='/logout'>Logout</a></div>
            : <div>Not logged in <a href='/login'>Login</a></div>}
          </div>
        );
    }
});


var Header = React.createClass({
    navigate(event) {
        event.preventDefault();
        var user = store.getUser().toJS();
        if (user.username) {
            browserHistory.push('/projects');
        }

    },

    render() {
        var user = store.getUser().toJS();
        return (
          <header className='top-header'>
            <a onClick={this.navigate} href='#'>
               <img src='/img/logo.png' className='logo' />
            </a>
            {user.initialized && (
              <div className='user-container'>
                <UserInfo user={user} />
              </div>
            )}
          </header>
        );
    }

});

var intercomSnippet = `
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/lmps7kt9';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>
`;


var intercomSnippet2 = `
<script>
  window.intercomSettings = {
    app_id: "ojq15o4y"
  };
</script>
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/ojq15o4y';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>
`;


function injectIntercom() {
//    $('body').append($(intercomSnippet));

    $('head').append($(intercomSnippet));
}


var App = React.createClass({

	update() {
		this.setState({
			projects: store.getProjects()
		});
	},

    componentWillMount() {
        injectIntercom();
    },
	componentDidMount() {
		store.addListener(this.update);
        store.fetchUser();

	},


	componentWillUnmount() {
		store.removeListener(this.updateCallback);
	},

    render() {

    	return (
            <div className={styles.container}>
              <Header/>
              {React.cloneElement(this.props.children, {store})}
            </div>
      );
    }

});

module.exports = App;
