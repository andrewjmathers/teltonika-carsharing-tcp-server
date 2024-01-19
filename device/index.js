const {
    onDataReceived,
    onPacketReceived,
    onImeiReceived,
    onRedisMessage,
    onRecord,
    onError,
    onClose,
    reset,
    execTcpCommand,
    execute
} = require('./methods')

class Device {
    constructor(sock) {
        this.imei = null;
        this.sock = sock;
        this.ackSent = false;
        this.ackResp = false;
        this.awaitingResponse = false;
        this.executionIndex = 0;
        this.command = null;
        this.home = null;
        this.failedCRCRetry = 0

        this.onDataReceived = onDataReceived.bind(this);
        this.onImeiReceived = onImeiReceived.bind(this);
        this.onPacketReceived = onPacketReceived.bind(this);
        this.onRecord = onRecord.bind(this);
        this.execute = execute.bind(this);
        this.execTcpCommand = execTcpCommand.bind(this);
        this.onClose = onClose.bind(this);
        this.reset = reset.bind(this);
        this.onError = onError.bind(this);
        this.onRedisMessage = onRedisMessage.bind(this);
        this.responseStorage = {};

        sock.on('data', this.onDataReceived)
        sock.on('close', this.onClose);
        sock.on('error', this.onError);
    }
}

module.exports = Device