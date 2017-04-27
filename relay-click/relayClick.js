(function() {
  'use strict';

  class RelayClick {

    /**
     * customize your project here to reflect the uuid of your service and characteristics.
     */
    constructor() {
        this.deviceName = 'bulbs';
        this.serviceUUID = '0000a032-0000-1000-8000-00805f9b34fb';
        this.characteristic1UUID = '0000a040-0000-1000-8000-00805f9b34fb';
        this.device = null;
        this.server = null;
        // The cache allows us to hold on to characeristics for access in response to user commands 
        this._characteristics = new Map();
    }

    connect(){
        return navigator.bluetooth.requestDevice({
         filters: [{
          services:[this.serviceUUID]
         }]
        })
        .then(device => {
            this.device = device;
            return device.gatt.connect();
        })
        .then(server => {
            this.server = server;
            return Promise.all([
              server.getPrimaryService(this.serviceUUID)
              .then(service=>{
                return Promise.all([
                  this._cacheCharacteristic(service, this.characteristic1UUID),
                  // this._cacheCharacteristic(service, 'uuidCharacteristic2Here'),
                ])
              })
            ]);
        })
    }

  _cacheCharacteristic(service, characteristicUuid){
    return service.getCharacteristic(characteristicUuid)
    .then(characteristic => {
      this._characteristics.set(characteristicUuid, characteristic);
    });
  }

 _readCharacteristic(characteristicUuid) {
   let characteristic = this._characteristics.get(characteristicUuid);
   return characteristic.readValue()
   .then(value => {
     value - value.buffer ? value : new DataView(value);
     return value;
   });

 }
 _writeCharacteristic(characteristicUuid, value){
   let characteristic = this._characteristics.get(characteristicUuid);
   return characteristic.writeValue(value);
 }
}

window.relayClick = new RelayClick();

})();
