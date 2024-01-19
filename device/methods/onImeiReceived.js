const { REDIS_MESSAGES } = require('../../constants/messages')

async function onImeiReceived(hexToUtf8Trimmed) {
    this.executionIndex = 0;
    this.imei = hexToUtf8Trimmed;
    redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.DEVICE_CONNECTED }));
    devices[this.imei] = this;

    const currentCommand = await redisClient.get(this.imei);
    const currentCommandParsed = JSON.parse(currentCommand)

    redisSubscriber.subscribe(this.imei)
    redisSubscriber.on('message', this.onRedisMessage)

    this.command = currentCommandParsed
    this.home = currentCommandParsed?.home
}

module.exports = onImeiReceived