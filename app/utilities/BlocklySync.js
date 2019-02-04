import base64 from 'base64-js';

export default class BlocklySync {

  static sync = (props) => {
    const uartCharacteristic = props.uartCharacteristic;
    const savedList = props.savedList.map(item => (item.pythonCode || ''));

    const encoded = encodeURIComponent(JSON.stringify(savedList));
    const listByteArray = encoded.split('').map(c => c.charCodeAt());

    const byteArray = new Uint8Array([
      0xfe,
      ...listByteArray
    ]);

    try {
      const base64Data = base64.fromByteArray(byteArray);
      uartCharacteristic.writeWithResponse(base64Data)
        .then()
        .catch(e => console.warn(e.message));
    } catch (e) {
      console.warn(e.message);
    }
  };
}
