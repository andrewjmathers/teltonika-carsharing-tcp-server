const amqp = require('amqplib/callback_api');

const connectRabbitMQ = () => {
    amqp.connect(process.env.rabbitMQUrl + "?heartbeat=60", async function (err, conn) {
        if (err) {
            console.error("MQ", err.message);
            return setTimeout(connectRabbitMQ, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("MQ conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("MQ connection closed, reconnecting");
            return setTimeout(connectRabbitMQ, 1000);
        });
        console.log("MQ connected");
        global.rabbitMQPublish = conn;
        global.publisherChannel = conn.createChannel()
        await publisherChannel.assertQueue('records');
    });
}

module.exports = connectRabbitMQ
