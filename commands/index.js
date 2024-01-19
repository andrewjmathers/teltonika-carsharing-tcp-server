const tcpCommands = {
    startRent: [
        {
            cmd: 'lvcanopenalldoors',
            errors: ['CAN line flags are empty!', 'LVCAN not detected', 'CAN-CONTROL Not connected!'],
            success: 'CAN-CONTROL cmd executed successfully.'
        },
        {
            cmd: 'readio 67',
        }
    ],
    finishRent: [
        {
            cmd: 'getrecord',
            action: 'finishCheck',
            recordAsResponse: true,
            response: true
        },
        {
            cmd: 'setdigout ?1'
        },
        {
            cmd: 'getrecord',
            action: 'lockCheck',
            recordAsResponse: true,
            response: true
        },
        {
            cmd: 'lvcanclosealldoors',
            errors: ['CAN line flags are empty!', 'LVCAN not detected', 'CAN-CONTROL Not connected!'],
            success: 'CAN-CONTROL cmd executed successfully.',
        },
        {
            cmd: 'readio 87',
            response: true
        }
    ],
    forceFinishRent: [
        {
            cmd: 'lvcanclosealldoors',
            errors: ['CAN line flags are empty!', 'LVCAN not detected', 'CAN-CONTROL Not connected!'],
            success: 'CAN-CONTROL cmd executed successfully.',
        },
        {
            cmd: 'setdigout ?1'
        },
        {
            cmd: 'readio 87',
            response: true
        }
    ],
    testPolygon: [
        {
            cmd: 'on_demand_tracking2',
            action: 'finishCheck',
            recordAsResponse: true,
            response: true
        },
        {
            cmd: 'readio 87',
            response: true
        } 
    ],
    imoUnlock: [
        {
            cmd: 'setdigout ?0'
        },
    ],
    imoLock: [
        {
            cmd: 'setdigout ?1'
        },
    ],
    imoUnlockCallback: [
        {
            cmd: 'setdigout ?0'
        },
        {
            cmd: 'getrecord',
            action: 'lockCheck',
            recordAsResponse: true,
            response: true
        },
    ],
    imoLockCallback: [
        {
            cmd: 'setdigout ?1'
        },
        {
            cmd: 'getrecord',
            action: 'lockCheck',
            recordAsResponse: true,
            response: true
        },
    ],
    lockCallback: [
        {
            cmd: 'lvcanclosealldoors'
        },
        {
            cmd: 'getrecord',
            action: 'lockCheck',
            recordAsResponse: true,
            response: true
        },
    ],
    unlockCallback: [
        {
            cmd: 'lvcanopenalldoors'
        },
        {
            cmd: 'getrecord',
            action: 'lockCheck',
            recordAsResponse: true,
            response: true
        },
    ],
    lock: [
        {
            cmd: 'lvcanclosealldoors'
        },
    ],
    unlock: [
        {
            cmd: 'lvcanopenalldoors'
        },
    ],
    getRecord: [
        {
            cmd: 'readio 90'
        }
    ]
}

module.exports = tcpCommands;