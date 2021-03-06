var fs = require('fs');

var tako = require('tako')
var spawn = require('child_process').spawn

var app = tako()
app.route('/').file(__dirname + '/client/index.html');
app.route('/*').files(__dirname + '/client');
app.httpServer.listen(8000)

var freq = 4000

var getFrame = function() {
  setTimeout(function() {
    var frame = spawn(
      '/usr/bin/streamer', 
      ['-t', '2', '-o', 'frame00.jpeg']
    )
    frame.on('close', function (code) {
      fs.readFile('frame01.jpeg', function(err, file) {
        app.sockets.emit('frames', { frame: "data:image/jpeg;base64," + file.toString('base64')});        
        getFrame();
      })      
    });
    frame.stderr.on('data', function (data) {
      console.log(data.toString());
    });
    }, freq);
};


app.sockets.on('connection', function (socket) {  
  getFrame();
})

