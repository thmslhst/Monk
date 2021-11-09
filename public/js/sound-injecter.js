'use strict';

/**
*
th0maslh0est
------------
*
**/

const OSCManager = require('./osc-manager').OSCManager;

exports.SoundInjecter = class SoundInjecter{

    constructor(emitter){

      var self = this;

      this.audioContext = new AudioContext();

      this.audioInput = null;
      this.inputPoint = null;
      this.analyserContext = null;
      this.analyser = null;
      this.zeroGain = null;
      this.bufferLength = null;
      this.dataArray = [];

      function gotStream(stream){

          self.inputPoint = self.audioContext.createGain();
          self.audioInput = self.audioContext.createMediaStreamSource(stream);
          self.audioInput.connect(self.inputPoint);

          //

          self.analyser = self.audioContext.createAnalyser();
          self.analyser.fftSize = 2048;
          self.analyser.smoothingTimeConstant = 0.3;
          self.inputPoint.connect(self.analyser);

          //

          self.bufferLength = self.analyser.frequencyBinCount;
          self.dataArray = new Uint8Array(self.bufferLength);

          //

          self.zeroGain = self.audioContext.createGain();
          self.zeroGain.gain.value = 0.0;
          self.inputPoint.connect(self.zeroGain);
          self.zeroGain.connect(self.audioContext.destination);

          //---------------------------------

          emitter.emit('gotaudiostream', {
            bufferSize: self.bufferLength
          });

          //---------------------------------
          // send fft

          window.requestAnimationFrame(function update(){
            self.analyser.getByteFrequencyData(self.dataArray);
            let fft = Array.from(self.dataArray);
            OSCManager.send('/sound/fft', fft);
            //---------------------------------
            window.requestAnimationFrame(update);
          });
      }

      //---------------------------

      MediaStreamTrack.getSources(function(sources){

        for (var i = 0; i < sources.length; i++){
          if(sources[i].label !== ''){
            emitter.emit('audiosource-detected', sources[i].label);
          }
        }

        navigator.webkitGetUserMedia({
            audio: {
                //optional: [{sourceId: sources[2].id}],
                mandatory: {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
            }
        },
        gotStream,
        function(e){
            console.log('Error getting audio ---> ' + e);
        });
      });
    }
}
