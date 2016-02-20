var cote = require('cote', {multicast: '239.1.1.1'});

var monitor = new cote.Monitor({
    name: 'monitor'
}, {disableScreen: true});

monitor.on('status', function(status) {
    console.log(status);
});
