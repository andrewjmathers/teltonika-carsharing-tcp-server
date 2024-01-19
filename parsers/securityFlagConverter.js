const securityFlagsConverter = (hex, byte, flagValue) => {
    const isFlagSet = (actual, expected) => {
        const flag = actual & expected;
        return flag === expected;
    }

    const binaryString = parseInt(hex, 16).toString(2)

    const start = binaryString.length - 8 * byte
    let end = start - 8
    if (end < 0) end = 0;

    const selectByte = binaryString.slice(end, start);

    const flag = isFlagSet(selectByte, flagValue)

    return flag;
}

module.exports = securityFlagsConverter