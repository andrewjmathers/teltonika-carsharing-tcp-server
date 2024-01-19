const tcpCommands = require('../../commands');
const { gprsConverter } = require('../../parsers')

function execTcpCommand(commands, socket, executionIndex) {
    const command = commands[executionIndex];
    const action = gprsConverter(command.cmd);
    const actionHex = Buffer.from(action, 'hex');
    socket.write(actionHex, function () {
        console.log(`Successfully sent a command: ${command.cmd}`);
    });
}

function execute() {
    this.execTcpCommand(tcpCommands[this.command.action], this.sock, this.executionIndex)
    this.awaitingResponse = true;
}

module.exports = {
    execTcpCommand,
    execute
}