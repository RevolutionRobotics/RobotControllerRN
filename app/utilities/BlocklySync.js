import base64 from 'base64-js';

export default class BlocklySync {

  static packetSize = 512;

  static sync = (props) => {
    const uartCharacteristic = props.uartCharacteristic;
    if (!uartCharacteristic) {
      return;
    }

    const savedList = props.savedList.map(item => (item.pythonCode || ''));
    const encoded = encodeURIComponent(JSON.stringify(savedList));
    const listByteArray = encoded.split('').map(c => c.charCodeAt());

    try {
      BlocklySync.sendPacket(uartCharacteristic, listByteArray, 0);
    } catch (e) {
      console.warn(e.message);
    }
  };

  static sendPacket = (characteristic, array, index) => {
    const firstByte = index * BlocklySync.packetSize;
    const lastByte = firstByte + BlocklySync.packetSize;

    const packetArray = new Uint8Array([
      0xfe,
      (lastByte >= array.length) | 0,
      ...(array.slice(firstByte, lastByte))
    ]);

    try {
      characteristic.writeWithResponse(base64.fromByteArray(packetArray))
        .then(() => {
          if (lastByte <= array.length) {
            BlocklySync.sendPacket(characteristic, array, index + 1);
          }
        })
        .catch(e => console.warn(e.message));
    } catch (e) {
      console.warn(e.message);
    }
  };
}
