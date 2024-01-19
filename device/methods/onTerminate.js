const { REDIS_MESSAGES } = require('../../constants/messages')

function onError(error) {
    this.sock.end()
    this.sock.destroy()
    redisSubscriber.removeListener('message', this.onRedisMessage);
    this.reset()
    clearTimeout(this.expireCommand)
    console.error(`${this.sock.remoteAddress}:${this.sock.remotePort} Connection Error ${error}`);
}

function reset() {
    devices[this.imei] = null
    this.ackSent = false;
    this.ackResp = false;
    this.awaitingResponse = false;
    this.failedCRCRetry = 0;
    this.imei = null;

    clearTimeout(this.expireCommand)

}

function onClose() {
    const disconnectedDuringExection = this.imei && this.executionIndex || this.command
    if (disconnectedDuringExection) {
        redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.FAILED, data: 'disconnected' }));
    }
    this.sock.end()
    this.sock.destroy()
    this.reset()
    redisSubscriber.removeListener('message', this.onRedisMessage);
    console.log(`${this.sock.remoteAddress}:${this.sock.remotePort} Terminated the connection`);
}

module.exports = {
    onError,
    onClose,
    reset
}