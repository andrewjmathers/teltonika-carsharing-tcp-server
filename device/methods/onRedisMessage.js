const { REDIS_MESSAGES } = require('../../constants/messages')

async function onRedisMessage(channel, message) {
    console.log('redis message came in', channel, message, this.imei)
    if(channel === this.imei && message === 'redis_cmd') {
        redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.CONNECTION_EXISTS}));
        const currentCommand = await redisClient.get(this.imei);
        const currentCommandParsed = JSON.parse(currentCommand)

        this.command = currentCommandParsed
        this.home = currentCommandParsed?.home

        return this.execute()
    }

    return
}

module.exports = onRedisMessage