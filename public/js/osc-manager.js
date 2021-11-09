'use strict';

const ipc = require('electron').ipcRenderer;

//---------------------------

const event = 'osc-sent';

//---------------------------

exports.OSCManager = class OSCManager{
  static send(address, args){
    ipc.send(event, {
        address: '/mira' + address,
        args: args
    });
  }
}
