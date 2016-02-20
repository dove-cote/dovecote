const repl = require('repl');
const replServer = repl.start({prompt: '> '});

replServer.context.server = require('dovecote/server');
replServer.context.app = require('dovecote/app');

replServer.on('exit', () => {
    process.exit();
});
