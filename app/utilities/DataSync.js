import base64 from 'base64-js';
import AppConfig from 'utilities/AppConfig';

export default class DataSync {

  static packetSize = 512;

  static sync = (props, callback) => {
    const longMessageService = props.robotServices.find(item => (
      item.uuid === AppConfig.services.longMessage.id
    ));

    if (!longMessageService) {
      return;
    }

    const assignments = props.buttonAssignments;
    const savedConfig = props.savedConfigList.find(config => (
      config.name === props.selectedName
    ));

    const blocklies = props.savedList
      .filter(blockly => (
        assignments.some(assignment => assignment.blocklyName === blockly.name)
      ))
      .map(blockly => ({
        pythonCode: blockly.pythonCode || '',
        assignments: assignments
          .filter(assignment => assignment.blocklyName === blockly.name)
          .map(assignment => ({ 
            layoutId: assignment.layoutId,
            btnId: assignment.btnId
          }))
      }));

    const byteArray = encodeURIComponent(JSON.stringify({
      robotConfig: (savedConfig || AppConfig.defaultRobotConfig('')).ports,
      blocklyList: blocklies
    })).split('').map(c => c.charCodeAt());

    try {
      longMessageService.characteristics()
        .then(characteristics => {
          const sendConfigCharacteristic = AppConfig
            .findCharacteristic(characteristics, 'longMessage', 'sendConfiguration');

          if (sendConfigCharacteristic) {
            DataSync.sendPacket(sendConfigCharacteristic, byteArray, 0, callback);
          } else {
            callback();
          }
        });
    } catch (e) {
      console.warn(e.message);
      callback(e);
    }
  };

  static sendPacket = (characteristic, array, index, callback) => {
    const firstByte = index * DataSync.packetSize;
    const lastByte = firstByte + DataSync.packetSize;

    const packetArray = new Uint8Array([
      0xfe,
      ~~(lastByte >= array.length),
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
