
// Express requires these dependencies
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express()

var logger = require('morgan')
var bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', routes.index);

// app.use(notFoundHandler)
// app.use(errorHandler)

// function notFoundHandler (req, res, next) {
//     var err = new Error('Not Found')
//     err.status = 404
//     next(err)
// }

// function errorHandler (err, req, res, next) {
//     res.locals.message = err.message
//     res.locals.error = req.app.get('env') === 'development' ? err : {}
//     res.status(err.status || 500)
//     res.render('error')
// }

// Enable Socket.io
var server = http.Server(app);
var io = require('socket.io')(server);

// A user connects to the server (opens a socket)
io.on('connection', function (socket) {

  console.log("a user connected: " + socket.id);

  socket.on('disconnect', function(){
      console.log('user disconnected');
  });

  socket.emit('welcome', { hello: 'world' });
  socket.on('thanks', function (data) {
      console.log(data);
  });

  // A User starts a path
  socket.on( 'startPath', function( data, sessionId ) {

      console.log('sessionId');
    socket.broadcast.emit( 'startPath', data, sessionId );

  });

  // A User continues a path
  socket.on( 'continuePath', function( data, sessionId ) {

    socket.broadcast.emit( 'continuePath', data, sessionId );

  });

  // A user ends a path
  socket.on( 'endPath', function( data, sessionId ) {

    socket.broadcast.emit( 'endPath', data, sessionId );

  });  

});

exports.io = io

server.listen( app.get('port'), function() {
    console.log('Server listening at port: ' + app.get('port'))
});