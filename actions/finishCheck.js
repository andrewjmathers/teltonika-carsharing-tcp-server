const checkIfCarInBounds = require('../utils/carWithinBoundries');
const turf = require('@turf/turf');
const { securityFlagsConverter } = require('../parsers');
const { securityFlagsP2, securityFlagsIndex, securityFlagsBlockers } = require('../constants/securityFlags');

const finishCheck = (data, _imei, home, polygons) => {
    const lastItem = data.AVL_Datas[data.AVL_Datas?.length - 1];
    const avlData = lastItem;
    const securityFlags = avlData?.IOelement?.Elements[securityFlagsIndex]

    const securityFlagsStatus = securityFlagsP2
        .filter(index => !!securityFlagsBlockers.some(securityFlagsBlocker => securityFlagsBlocker === index.value))
        .map(securityFlag => securityFlagsConverter(securityFlags, securityFlag.byte, securityFlag.hexValue) ? securityFlag.value : null)

    const containsBlockers = securityFlagsStatus.filter(securityFlag => securityFlagsBlockers.includes(securityFlag));

    const isDesignatedParking = home.includes('restricted');

    const isCarInBounds = polygons.some(polygon => polygon?.features?.some(polygonFeature => checkIfCarInBounds(lastItem.GPSelement, polygonFeature)))
    const carLocation = [lastItem?.GPSelement?.Longitude, lastItem?.GPSelement?.Latitude]
    const distanceLessThan500 = polygons.some(polygon => turf.distance(polygon.center, carLocation) < 0.5);

    const outsideParkingArea = isDesignatedParking ? !distanceLessThan500 : !isCarInBounds

    if (outsideParkingArea) {
        return { pass: false, data: 'outside_parking_area' };
    }

    if (containsBlockers.length) {
        return { pass: false, data: containsBlockers }
    }

    return { pass: true }
}

module.exports = finishCheck;