const { ProtocolParser } = require('complete-teltonika-parser');
const { REDIS_MESSAGES } = require('../../constants/messages')
const tcpCommands = require('../../commands');
const toBytesInt32 = require('../../utils/toBytesInt32')
const { gprsConverter } = require('../../parsers');
const actions = require('../../actions');

async function onPacketReceived(data) {
    if(!this.imei) return this.sock.destroy();
    try {
        const parsed = new ProtocolParser(data.toString('hex'))
        this.failedCRCRetry = 0 //resets failed CRC retries if any
        console.log(`${this.sock.remoteAddress}:${this.sock.remotePort}:`, parsed, parsed.Content, 'parsed')

        const currentExecutionCmd = this.command?.action ? tcpCommands[this.command?.action] && tcpCommands[this.command?.action][this.executionIndex] : null;
        if (!parsed.Content.isResponse && !currentExecutionCmd?.recordAsResponse) {
            if(!this.command) {
                return this.onRecord(parsed);
            }
        }
        if (parsed.Content.isResponse) {
            console.log(`${this.sock.remoteAddress}:${this.sock.remotePort} says: Received a response: ${parsed.Content.responseStr}, executionIndex: ${this.executionIndex}`)
            const commandFailed = this.command && this.executionIndex && tcpCommands[this.command?.action][this.executionIndex]?.success && !tcpCommands[this.command?.action][this.executionIndex]?.success === parsed.Content.responseStr;
            const awaitingDataBack = this.command && this.executionIndex && tcpCommands[this.command?.action][this.executionIndex]?.response;
            this.awaitingResponse = false

            if (commandFailed) {
                clearTimeout(this.expireCommand)
                return redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.FAILED, data: parsed.Content.responseStr }));
            }
            if (awaitingDataBack) {
                const valueString = parsed?.Content?.responseStr;
                const valueStringSplit = valueString?.split(' ');
                if (valueStringSplit[0] !== 'IO') {
                    console.log(`\n${this.sock.remoteAddress}:${this.sock.remotePort} says: ${this.imei} awaited response is not an IO value\n`);
                    redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.FAILED, data: parsed.Content.responseStr }));
                    clearTimeout(this.expireCommand)
                    this.awaitingResponse = false;
                    this.executionIndex = 0;
                    this.onClose()
                    return;
                }

                const id = valueStringSplit[1]?.replace('ID:', '');
                const value = valueStringSplit[2]?.replace('Value:', '');

                this.responseStorage = {
                    [id]: value
                }
                console.log(`\nUpdated response storage: ${this.responseStorage}\n`);

            }
            if (this.command && this.executionIndex < tcpCommands[this.command.action]?.length - 1) {
                this.executionIndex = this.executionIndex + 1;
                console.log(`\nSending a command: ${tcpCommands[this.command.action][this.executionIndex]?.cmd}\n`)
                this.execTcpCommand(tcpCommands[this.command.action], this.sock, this.executionIndex)
                this.awaitingResponse = true
            }
        }
        if (currentExecutionCmd?.recordAsResponse) {
            this.awaitingResponse = false
            const check = (actions[currentExecutionCmd?.action](parsed.Content, this.imei, this.home, this.command?.polygons))

            const dataAmount = parsed.Quantity1;
            var sizeBytes = Buffer.from(toBytesInt32(dataAmount), 'hex');
            this.sock.write(sizeBytes)

            if (!check.pass) {
                this.command = null;
                this.executionIndex = 0;
                console.log(`\n${this.imei}: Emitting failed check\n`)
                clearTimeout(this.expireCommand)
                redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.FAILED, data: check.data }));
                return this.onClose();
            } else {
                if(check?.flags) {
                    this.responseStorage = {
                        ...this.responseStorage,
                        flags: check.flags,
                        elements: check.elements,
                    }
                }
                if (this.command && this.executionIndex < tcpCommands[this.command.action]?.length - 1) {
                    this.executionIndex = this.executionIndex + 1;
                    console.log(`\n${this.sock.remoteAddress}:${this.sock.remotePort} says: sending a command: ${tcpCommands[this.command.action]?.cmd}\n`)
                    this.execTcpCommand(tcpCommands[this.command.action], this.sock, this.executionIndex)
                    this.awaitingResponse = true

                    return;
                }
            }
        }

        if (this.executionIndex >= tcpCommands[this.command?.action]?.length - 1 && !this.awaitingResponse) {
            console.log(`\n${this.imei}: finishing execution of ${this.command?.action}\n`)

            redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.SUCCESS, data: this.responseStorage }));
            clearTimeout(this.expireCommand)
            this.expireCommand = null;
            this.command = null;
            this.executionIndex = 0;

            const action = gprsConverter('getrecord');
            const actionHex = Buffer.from(action, 'hex');

            this.sock.write(actionHex, () => {
                console.log(`\n${this.imei}: Successfully sent closure getrecord\n`);
            });
        }
    } catch (err) {
        if((err?.message?.includes('Found CRC') || err?.message?.includes('Item quantity')) && this.failedCRCRetry < 2){
            if (this.command && this.executionIndex < tcpCommands[this.command.action]?.length - 1) {
                console.log(`\n${this.imei} says: failed CRC, retrying a command: ${tcpCommands[this.command.action]?.cmd}\n`)
                ++this.failedCRCRetry
                return this.execTcpCommand(tcpCommands[this.command.action], this.sock, this.executionIndex)
            }
        }
        console.log(err, 'err')
        clearTimeout(this.expireCommand)
        this.onClose()
        return redisClient.publish(this.imei, JSON.stringify({ message: REDIS_MESSAGES.FAILED, data: err }));
    }
}

module.exports = onPacketReceived