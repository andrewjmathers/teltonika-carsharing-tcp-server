const securityFlagsTypes = {
    IGNITION: 'ignition',
    CLOSED: 'closed',
    CLOSEDREMOTE: 'closedRemote',
    ALARM: 'alarm',
    HANDBRAKE: 'handbrake',
    FRONTLEFTDOOR: 'frontLeftDoor',
    FRONTRIGHTDOOR: 'frontRightDoor',
    REARLEFTDOOR: 'rearLeftDoor',
    REARRIGHTDOOR: 'rearRightDoor',
    TRUNK: 'trunk',
    ROOF: 'roof'
}

const securityFlagsValues = {
    IGNITIONON: "ignition on",
    CARISCLOSED: "car is closed",
    CARISCLOSEDFACTORY: "car is closed by factory's remote control",
    ALARMPANIC: "factory installed alarm system is actuated (is in panic mode",
    HANDBRAKEON: "handbrake is actuated (information available only with ignition on",
    FRONTLEFTDOOROPEN: "front left door open",
    FRONTRIGHTDOOROPEN: "front right door open",
    REARLEFTDOOROPEN: "rear left door open",
    REARRIGHTDOOROPEN: "rear right door open",
    TRUNKOPEN: "trunk door open",
    ROOFOPEN: "roof open"
}

const securityFlagsIndex = '132';

const securityFlagsP2 = [
    { id: securityFlagsTypes.IGNITION, byte: 3, hexValue: 0x02, value: securityFlagsValues.IGNITIONON },
    { id: securityFlagsTypes.CLOSED, byte: 3, hexValue: 0x10, value: securityFlagsValues.CARISCLOSED },
    { id: securityFlagsTypes.CLOSEDREMOTE, byte: 3, hexValue: 0x20, value: securityFlagsValues.CARISCLOSEDFACTORY },
    { id: securityFlagsTypes.ALARM, byte: 3, hexValue: 0x40, value: securityFlagsValues.ALARMPANIC },
    { id: securityFlagsTypes.HANDBRAKE, byte: 4, hexValue: 0x10, value: securityFlagsValues.HANDBRAKEON },
    { id: securityFlagsTypes.FRONTLEFTDOOR, byte: 5, hexValue: 0x01, value: securityFlagsValues.FRONTLEFTDOOROPEN },
    { id: securityFlagsTypes.FRONTRIGHTDOOR, byte: 5, hexValue: 0x02, value: securityFlagsValues.FRONTRIGHTDOOROPEN },
    { id: securityFlagsTypes.REARLEFTDOOR, byte: 5, hexValue: 0x04, value: securityFlagsValues.REARLEFTDOOROPEN },
    { id: securityFlagsTypes.REARRIGHTDOOR, byte: 5, hexValue: 0x08, value: securityFlagsValues.REARRIGHTDOOROPEN },
    { id: securityFlagsTypes.TRUNK, byte: 5, hexValue: 0x20, value: securityFlagsValues.TRUNKOPEN },
    { id: securityFlagsTypes.ROOF, byte: 5, hexValue: 0x40, value: securityFlagsValues.ROOFOPEN },
]

const securityFlagsBlockers = [
    securityFlagsValues.IGNITIONON,
    //securityFlagsValues.CARISCLOSEDFACTORY,
    securityFlagsValues.FRONTLEFTDOOROPEN,
    securityFlagsValues.FRONTRIGHTDOOROPEN,
    securityFlagsValues.REARLEFTDOOROPEN,
    securityFlagsValues.REARRIGHTDOOROPEN,
    securityFlagsValues.TRUNKOPEN
];

module.exports = {
    securityFlagsTypes,
    securityFlagsP2,
    securityFlagsIndex,
    securityFlagsBlockers
}