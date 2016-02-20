var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO || 'mongodb://localhost/dovecote');

mongoose.connection.on(
    'error',
    console.error.bind(console, 'Mongo connection error')
);

mongoose.connection.once('open', function() {
    console.log('Connected to mongo');
});
