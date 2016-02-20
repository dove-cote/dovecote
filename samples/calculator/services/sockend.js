var cote = require('cote', {multicast: '239.1.1.1'});
var http = require('http');
var fs = require('fs');
var socketIO = require('socket.io');


function handler(req, res) {
    fs.readFile(__dirname + '/../index.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

app = http.createServer(handler);
app.listen(process.argv[2] || 5555);

io = socketIO.listen(app);

new cote.Sockend(io, {
    name: 'sockend'
});
