const crc16 = require('./crc16');

function toHex (str) {
    let hexDataList = []
    for (let i = 0; i < str.length; i++) {
        hexDataList.push(str.charCodeAt(i).toString(16).padStart(2, '0'))
    }
    return hexDataList.join('')
}

function gprsConverter (command) {
    command = toHex(command)
    let commandSize = (command.length / 2).toString(16)
    let data = {
        CodecID: '0C',
        CommandQuantity1: '01',
        Type: '5'.padStart(2, '0'),
        CommandSize: commandSize.padStart(8, '0'),
        Command: command,
        CommandQuantity2: '01',
    }
    let dataStr = Object.values(data).reduce((acc, item) => acc + item, '')
    
    const crc16Parsed = crc16(Buffer.from(dataStr, "hex")).toString(16)
    let returnObj = ''.padStart(8, '0') + (dataStr.length/2).toString(16).padStart(8, '0') + dataStr + '0000' + crc16Parsed
    return returnObj.toUpperCase()
}

module.exports = gprsConverter