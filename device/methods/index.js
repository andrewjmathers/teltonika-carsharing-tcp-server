const onDataReceived = require('./onDataReceived');
const onImeiReceived = require('./onImeiReceived');
const { onError, onClose, reset } = require('./onTerminate');
const onRedisMessage = require('./onRedisMessage');
const onPacketReceived = require('./onPacketReceived');
const onRecord = require('./onRecord');
const { execTcpCommand, execute } = require('./execute');

module.exports = {
    onDataReceived,
    onImeiReceived,
    onError,
    onClose,
    reset,
    onRedisMessage,
    onPacketReceived,
    onRecord,
    execute,
    execTcpCommand
}