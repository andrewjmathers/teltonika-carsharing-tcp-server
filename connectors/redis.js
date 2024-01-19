const Redis = require('ioredis');

const connectRedis = async () => {
    global.redisClient = new Redis({
        password: process.env.redisPW,
        host:  process.env.redisURL,
        port: process.env.redisPort,
        //connectTimeout: 120000,
        reconnectOnError: true,
    })

    global.redisSubscriber = new Redis({
        password: process.env.redisPW,
        host:  process.env.redisURL,
        port: process.env.redisPort,
        //connectTimeout: 120000,
        reconnectOnError: true,
    })
}

module.exports = connectRedis;