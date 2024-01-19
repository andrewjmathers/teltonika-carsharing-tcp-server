const readBeacon = (beaconString, timestamp) => {
    const beaconHex = parseInt(beaconString, 10).toString(16);
    const hex = new Buffer.from(beaconHex, 'hex')

    let currentByte = 1;

    const beacons = []

    const getRSSIValue = (rssi) => {
        const decimalValue = parseInt(rssi, 16);

        if (decimalValue > 127) {
            const complement = decimalValue - 256;
            return complement;
        } else {
            return decimalValue; // Output: 186
        }
    }

    const getBeaconData = (hex, beaconType) => {
        currentByte += 1;
        if(beaconType == 21) {
            const UUID = hex.slice(currentByte, currentByte + 16).toString('hex')
            currentByte += 16
            const major = hex.slice(currentByte, currentByte + 2).toString('hex')
            currentByte += 2
            const minor = hex.slice(currentByte, currentByte + 2).toString('hex')
            currentByte += 2
            const RSSI = getRSSIValue(hex.slice(currentByte, currentByte + 1).toString('hex'))
            currentByte += 1

            return {
                beaconType,
                UUID,
                major,
                minor,
                RSSI,
                timestamp 
            };
        }
        if(beaconType == 01 || beaconType == 07) {
            const namespace = hex.slice(currentByte, currentByte + 10).toString('hex')
            currentByte += 10
            const instanceId = hex.slice(currentByte, currentByte + 6).toString('hex')
            currentByte += 6
            const RSSI = getRSSIValue(hex.slice(currentByte, currentByte + 1).toString('hex'))
            currentByte += 1
            const beacon = {
                beaconType,
                namespace,
                instanceId,
                RSSI,
                timestamp   
            }
            if(beaconType == 07){
                beacon.voltage = parseInt(hex.slice(currentByte, currentByte + 2).toString('hex'), 16)
                currentByte += 2
                beacon.temperature = parseInt(hex.slice(currentByte, currentByte + 2).toString('hex'), 16)
                currentByte += 2
            }
            return beacon
        }
    }

    if(hex.length <= 1) {
        return null;
    }

    while(currentByte < hex.length) {
        const beaconType = parseInt(hex[currentByte], 10).toString(16);
        if(!beaconType) break;
        const beacon = getBeaconData(hex, beaconType)
        beacons.push(beacon)
    }

    return beacons
}

module.exports = readBeacon