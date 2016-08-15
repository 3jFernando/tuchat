var io = require('socket.io'),
	http = require('http'),
	server = http.createServer(),
	io = io.listen(server);

io.on('connection', function(socket) {
	console.log('Cliente connectado');

	socket.on('message', function(datamsg) {
		io.emit(datamsg.room+'message', datamsg.data);
	});

	socket.on('entuchatactivo', function(estado) {
		io.emit(estado.room+'entuchatactivo', estado.data);
	});
	socket.on('entuchatinactivo', function(estado) {
		io.emit(estado.room+'entuchatinactivo', estado.data);
	});

    socket.on('disconnect', function () {
        console.log('Cliente desconnectado');
    });
});

server.listen(5000, function() {
	console.log('Servidor connectado');
});
