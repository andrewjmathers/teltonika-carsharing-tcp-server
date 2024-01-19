# teltonika-carsharing-tcp-server

### A TCP server for Teltonika GPS devices with support for CAN-CONTROL. Suitable for carsharing

This server needs **Redis** and **RabbitMQ** servers configured and running to function.

**Redis** is used to transfer commands for devices to be executed

**RabbitMQ** is used to queue records to be processed by your client/server which you can use to save them to your database

You can use Free tiers at services like:

[cloudamqp](https://cloudamqp.com)

[redislabs](https://redislabs.com)

Or setup your own

### .env example:

```
rabbitMQUrl=*
redisURL=*
redisPW=*
redisPort=*
```

## Usage

### Running the server

run `npm i` to install the dependencies

run `npm start` to start the server

### Testing locally

If you want to connect **Teltonika** devices to this server while running on localhost for test or development you need to expose your localhost

This can be achieved through services like [Ngrok](https://ngrok.com) or [Telebit](https://telebit.cloud)

### Queuing commands

To send a GPRS command to your device use [ioredis](https://github.com/redis/ioredis) on your client or server.

## Example:

```
const sendSms = require('./smsUtils'); // Your function to call SMS API to force device to connect

const IOTcommunicator = ({ imei, phone, iccid, command }) => {
    redisClient.set(imei, command, 'EX', 60); // queues command for execution
    
    const sendSmsTimer = setTimeout(() => sendSms({ imei, phone, iccid }), 2000)

    redisListener.subscribe(imei);

    const onMessage = (channel, message) => {
        if (channel === imei && message !== 'redis_cmd') { // don't listen to redis_cmd which originates from your client, make sure channel matches the IMEI
            const messageParsed = JSON.parse(message)
            if (messageParsed.message === 'connection_exists') {
                // don't call the sms function if connection is already live
                clearTimeout(sendSmsTimer)
            } else {
                ... Your logic 
            }
            console.log(`Received message from ${channel}: ${message}`);
        }
    }

    redisListener.on('message', onMessage);

    redisClient.publish(imei, 'redis_cmd');
}

module.exports = IOTcommunicator
```

Redis messages:

```
  SUCCESS: 'success',
  FAILED: 'failed',
  DEVICE_CONNECTED: 'device_connected',
  CONNECTION_EXISTS: 'connection_exists'
```

if message is SUCCESS, the response may also contain `data` - `{ message: REDIS_MESSAGES.SUCCESS, data: this.responseStorage }`


## Commands

You can find available commands in `./commands` eg `startRent` `finishRent` etc or add your own

