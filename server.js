require('dotenv').config();
const net = require('net');
const Device = require('./device');
const connectRabbitMQ = require('./connectors/rabbitMQ');
const connectRedis = require('./connectors/redis');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
    // Create a worker for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    //Create an instance of the server
    const server = net.createServer(onClientConnection);

    //define host and port to run the server
    const port = 8080;
    const host = '127.0.0.1';
    //Start listening with the server on given port and host.
    server.listen(port, host, function () {
        console.log(`Server started on port ${port} at ${host}`);
    });

    //Connecting RabbitMQ publisher/consumer
    connectRabbitMQ();
    connectRedis();

    global.devices = {};

    //Declare connection listener function
    function onClientConnection(sock) {
        console.log(`${sock.remoteAddress}:${sock.remotePort} Connected`);

        new Device(sock)
    };
}