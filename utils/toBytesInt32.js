function toBytesInt32(num) {
    arr = new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        (num & 0x000000ff)
    ]);
    return arr.buffer;
}

module.exports = toBytesInt32;