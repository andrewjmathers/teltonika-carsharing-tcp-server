const { securityFlagConverter } = require('../parsers');
const { securityFlagsP2, securityFlagsTypes, securityFlagsIndex } = require('../constants/securityFlags');

const lockCheck = (data) => {
    const lastItem = data.AVL_Datas[data.AVL_Datas?.length - 1];
    const avlData = lastItem;
    const securityFlags = avlData?.IOelement?.Elements[securityFlagsIndex]

    const securityFlagsStatus = securityFlagsP2
        .filter(index => index.id === securityFlagsTypes.CLOSEDREMOTE || index.id === securityFlagsTypes.CLOSED)
        .map(securityFlag => securityFlagConverter(securityFlags, securityFlag.byte, securityFlag.hexValue) ? securityFlag.value : null)

    return { pass: true, lockStatus: !!securityFlagsStatus?.length, flags: securityFlagsStatus, elements: avlData?.IOelement?.Elements }
}

module.exports = lockCheck