const { REDIS_MESSAGES } = require('../../constants/messages')
const tcpCommands = require('../../commands');

async function onDataReceived(data) {
    console.log(`\n${this.imei || 'no imei'}: ${data.toString('hex')} raw data\n`)
    if (this.expireCommand) {
        redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.DEVICE_CONNECTED }));
        clearTimeout(this.expireCommand);
        const timeout = 30000;

        this.expireCommand = setTimeout(() => {
            console.log(`${this.imei}: Command ${this.command?.action} has expired after ${timeout / 1000} second timeout, because execution got stalled on step ${this.executionIndex}`);
            this.awaitingResponse = false;
            this.executionIndex = 0;
            this.command = null;
        }, timeout);
    }
    console.log(`${this.sock.remoteAddress}:${this.sock.remotePort} Says : ${data} `);
    const hexToUtf8 = Buffer.from(data, 'hex').toString('utf8').trim();
    const hexToUtf8Trimmed = hexToUtf8.replace(/[^a-zA-Z0-9 ]/g, "");

    if (hexToUtf8Trimmed.length !== 15 || isNaN(hexToUtf8Trimmed)) {
        return this.onPacketReceived(data)
    }
    if (hexToUtf8Trimmed.length === 15) {
        console.log(!isNaN(hexToUtf8Trimmed), 'isnan test')
        await this.onImeiReceived(hexToUtf8Trimmed)
        if (this.command && this.executionIndex < tcpCommands[this.command?.action]?.length && this.ackSent) {
            return this.execute()
        }
    }
    if (!this.awaitingResponse && !this.ackSent) {
        console.log(`${this.sock.remoteAddress}:${this.sock.remotePort} Says: Sending Ack back to the device`);
        const receiveAck = publisherChannel?.connection && publisherChannel?.connection?.stream?.writable ? '01' : '00';
        const confirmation = Buffer.from(receiveAck, 'hex');
        this.sock.write(confirmation);
        this.ackSent = true
        if (this.command) {
            return this.execute()
        }
    }
}

module.exports = onDataReceived