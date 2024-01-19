const { beaconConverter, securityFlagConverter } = require('../../parsers');
const { securityFlagsP2 } = require('../../constants/securityFlags');
const toBytesInt32 = require('../../utils/toBytesInt32')

async function onRecord(parsed) {
    this.ackResp = false;
    console.log(`${this.sock.remoteAddress}:${this.sock.remotePort}: ${parsed.Content}`, 'record')
    const securityFlagsIndex = '132';

    if (parsed?.Content?.AVL_Datas.length) {
        const parsedAVLBeacon = parsed?.Content?.AVL_Datas.filter(avlData => avlData?.IOelement?.EventID === 385)
        let beacons = []

        if(parsedAVLBeacon.length) {
            const avlData = parsedAVLBeacon[parsedAVLBeacon.length - 1];
            const beaconData = avlData?.IOelement?.Elements?.['385']
            const timestamp = avlData?.Timestamp;
            beacons = beaconConverter(beaconData, timestamp);
        }

        const parsedAVL = parsed?.Content?.AVL_Datas.map(avlData => {
            if(avlData?.IOelement?.EventID === 385) return null
            console.log(`${this.sock.remoteAddress}:${this.sock.remotePort}: `, avlData?.GPSelement, avlData?.IOelement?.Elements)
            const securityFlags = parseInt(avlData?.IOelement?.Elements[securityFlagsIndex])?.toString(16)
            console.log(securityFlags, 'sec flag')
            const securityFlagsParsed = securityFlagsP2?.map(securityFlagIndex => {
                if (securityFlagConverter(securityFlags, securityFlagIndex.byte, securityFlagIndex.hexValue)) {
                    return securityFlagIndex.value
                } else {
                    return null
                }
            }).filter(securityFlagIndex => !!securityFlagIndex)
            return ({
                securityFlags: securityFlagsParsed,
                elements: avlData?.IOelement?.Elements,
                eventID: avlData?.IOelement?.EventID,
                gps: avlData?.GPSelement,
                time: avlData?.Timestamp,
            })
        }).filter(avlData => !!avlData)

        const record = JSON.stringify({ message: this.imei, data: parsedAVL, beacons: beacons})

        publisherChannel.sendToQueue('record', Buffer.from(record))
    }
    const dataAmount = parsed.Quantity1;
    var sizeBytes = Buffer.from(toBytesInt32(dataAmount), 'hex');
    this.sock.write(sizeBytes)
}

module.exports = onRecord;