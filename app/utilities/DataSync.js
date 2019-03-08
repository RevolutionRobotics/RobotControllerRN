import base64 from 'base64-js';

export default class DataSync {

  static packetSize = 512;

  static sync = (props, callback) => {
    const uartCharacteristic = props.uartCharacteristic;
    if (!uartCharacteristic) {
      return;
    }

    const savedList = props.savedList.map(item => (item.pythonCode || ''));
    const savedConfig = props.savedConfig;

    const byteArray = encodeURIComponent(JSON.stringify({
      blocklyList: savedList,
      robotConfig: savedConfig
    })).split('').map(c => c.charCodeAt());

    try {
      DataSync.sendPacket(uartCharacteristic, byteArray, 0, callback);
    } catch (e) {
      console.warn(e.message);
    }
  };

  static sendPacket = (characteristic, array, index, callback) => {
    const firstByte = index * DataSync.packetSize;
    const lastByte = firstByte + DataSync.packetSize;

    const packetArray = new Uint8Array([
      0xfe,
      (lastByte >= array.length) | 0,
      ...(array.slice(firstByte, lastByte))
    ]);

    try {
      characteristic.writeWithResponse(base64.fromByteArray(packetArray))
        .then(() => {
          if (lastByte <= array.length) {
            DataSync.sendPacket(characteristic, array, index + 1, callback);
          } else {
            callback();
          }
        })
        .catch(e => {
          console.warn(e.message);
          callback(e);
        });
    } catch (e) {
      console.warn(e.message);
      callback(e);
    }
  };
}
