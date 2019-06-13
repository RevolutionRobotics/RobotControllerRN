/* eslint-disable no-console */
import base64 from 'base64-js';
import md5 from 'md5';
import AppConfig from 'utilities/AppConfig';

export default class DataSync {

  static STATUS_UNUSED = 0;
  static STATUS_UPLOAD = 1;
  static STATUS_VALIDATION = 2;
  static STATUS_READY = 3;
  static STATUS_VALIDATION_ERROR = 4;

  static MT_FIRMWARE_DATA = 1;
  static MT_FRAMEWORK_DATA = 2;
  static MT_CONFIGURATION_DATA = 3;
  static MT_TEST_KIT = 4;

  static PACKET_SELECT_LONG_MESSAGE_TYPE = 0
  static PACKET_INIT_TRANSFER = 1
  static PACKET_UPLOAD_MESSAGE = 2
  static PACKET_FINALIZE_MESSAGE = 3

  static packetSize = 512;

  static buildConfigurationMessage = props => {
    const assignments = props.buttonAssignments;
    const savedConfig = props.savedConfigList.find(config => (
      config.name === props.selectedName
    ));

    const blocklies = [{
      builtinScriptName: 'drive_joystick',
      assignments: {
        analog: [{
          channels: [0, 1],
          priority: 0
        }]
      }
    }];

    props.savedList
      .filter(blockly => (
        assignments.some(assignment => assignment.blocklyName === blockly.name)
      ))
      .forEach(blockly => {
        const assignmentObject = {};

        assignments
          .filter(assignment => assignment.blocklyName === blockly.name)
          .forEach(assignment => {
            if (assignment.btnId === -1) {
              assignmentObject['background'] = 2;
            } else {
              if (!assignmentObject.buttons) {
                assignmentObject.buttons = [];
              }

              assignmentObject.buttons.push({ 
                id: assignment.btnId,
                priority: 1
              });
            }
          });

        blocklies.push({
          pythonCode: blockly.pythonCode || '',
          assignments: assignmentObject
        });
      });

    const config = (savedConfig || AppConfig.defaultRobotConfig('')).ports;
    const configObject = Object.assign({}, ...config.map(item => ({
      [item.title.toLowerCase()]: item.data
    })));

    return JSON.stringify({
      robotConfig: configObject,
      blocklyList: blocklies
    }).split('').map(c => c.charCodeAt());
  };

  static sync = (props, callback) => {  // TODO: rename. this is only doing configsending
    const byteArray = DataSync.buildConfigurationMessage(props);
    DataSync.syncLongMessage(props, DataSync.MT_CONFIGURATION_DATA, byteArray, callback);
  };

  static readLongMessageStatus = async (longMessageCharacteristic) => {
    const updatedLongMessageCharacteristic = await longMessageCharacteristic.read();
    const rawBase64 = updatedLongMessageCharacteristic.value;
    const data = base64.toByteArray(rawBase64);

    let length = null
    let md5 = null;

    if (data.length >= 17) {
      md5 = data.slice(1, 17);
    }

    if (data.length >= 21) {
      length = (data[17] << 24) + (data[18] << 16) + (data[19] << 8) + data[20];
    }

    return {
      status: data[0],
      md5: md5,
      length: length
    }
  }

  static syncLongMessage = async (props, messageType, data, callback) => {
    const longMessageService = props.robotServices.find(item => (
      item.uuid === AppConfig.services.longMessage.id
    ));

    if (!longMessageService) {
      console.debug("syncLongMessage: exit no message service");
      return;
    }

    const sleep = (waitTimeInMs) => new Promise(resolve => {
      setTimeout(resolve, waitTimeInMs);
    });

    const longMessageCharacteristic = AppConfig.findCharacteristic(
      await longMessageService.characteristics(), 
      'longMessage', 
      'longMessages'
    );

    try {
      console.debug("syncLongMessage: selecting message type");
      await longMessageCharacteristic.writeWithResponse(base64.fromByteArray(
        new Uint8Array([DataSync.PACKET_SELECT_LONG_MESSAGE_TYPE, messageType])
      ));

      console.debug("syncLongMessage: calculating md5");
      const md5value = md5(data, { asBytes: true });
      // TODO read status to skip if already transferred
      console.debug("syncLongMessage: init transfer");
      await longMessageCharacteristic.writeWithResponse(base64.fromByteArray(
        new Uint8Array([DataSync.PACKET_INIT_TRANSFER, ...md5value])
      ));
      
      let offset = 0;
      console.debug("syncLongMessage: uploading data");
      while (offset < data.length) {
        await longMessageCharacteristic.writeWithResponse(
          base64.fromByteArray(new Uint8Array([
            DataSync.PACKET_UPLOAD_MESSAGE, 
            ...(data.slice(offset, offset + DataSync.packetSize))
          ])));
        offset += DataSync.packetSize;
      }
      console.debug("syncLongMessage: finalize message");
      await longMessageCharacteristic.writeWithResponse(base64.fromByteArray(
        new Uint8Array([DataSync.PACKET_FINALIZE_MESSAGE])
      ));
      
      let retryCount = 0;
      let success = false;
      
      while (retryCount < 5 && !success) {
        if (retryCount > 0) {
          await sleep(1000);
        }
        console.debug("syncLongMessage: polling result status");
        const status = (await DataSync.readLongMessageStatus(
          longMessageCharacteristic
        )).status;

        if (status == DataSync.STATUS_VALIDATION_ERROR) {
          throw new Error("Validation failed.");
        } else if (status == DataSync.STATUS_READY) {
          success = true;
        }
        retryCount += 1;
      }

      if (!success) {
        throw new Error("Validation timeout.");
      }

      console.debug("syncLongMessage: executing callback");
      callback();
    } catch (e) {
      console.warn(e.message);
      callback(e);
    }
  };
}
