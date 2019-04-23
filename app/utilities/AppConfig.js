export default class AppConfig {

  static services = {
    longMessage: {
      id: '97148a03-5b9d-11e9-8647-d663bd873d93',
      characteristicIds: {
        updateFirmware      : '97148a04-5b9d-11e9-8647-d663bd873d93',
        updateFramework     : '97148e28-5b9d-11e9-8647-d663bd873d93',
        testKit             : '97148f90-5b9d-11e9-8647-d663bd873d93',
        sendConfiguration   : '971490c6-5b9d-11e9-8647-d663bd873d93',
        changeName          : '971495d0-5b9d-11e9-8647-d663bd873d93'
      }
    },
    liveMessage: {
      id: 'd2d5558c-5b9d-11e9-8647-d663bd873d93',
      characteristicIds: {
        readMotor1          : '4bdfb409-93cc-433a-83bd-7f4f8e7eaf54',
        readMotor2          : '454885b9-c9d1-4988-9893-a0437d5e6e9f',
        readMotor3          : '00fcd93b-0c3c-4940-aac1-b4c21fac3420',
        readMotor4          : '49aaeaa4-bb74-4f84-aa8f-acf46e5cf922',
        readMotor5          : 'ceea8e45-5ff9-4325-be13-48cf40c0e0c3',
        readMotor6          : '8e4c474f-188e-4d2a-910a-cf66f674f569',
        readSensor1         : '135032e6-3e86-404f-b0a9-953fd46dcb17',
        readSensor2         : '36e944ef-34fe-4de2-9310-394d482e20e6',
        readSensor3         : 'b3a71566-9af2-4c9d-bc4a-6f754ab6fcf0',
        readSensor4         : '9ace575c-0b70-4ed5-96f1-979a8eadbc6b',
        periodicController  : '7486bec3-bb6b-4abd-a9ca-20adc281a0a4',
        keepAlive           : '9e55ea41-69c3-4729-9f9a-90bc27ab6253'
      }
    }
  };

  static findCharacteristic = (list, service, id) => list.find(item => (
    item.uuid === AppConfig.services[service].characteristicIds[id]
  ));
};
