'use strict';

const angular = require('angular');

exports.GUI = class GUI{

    constructor(emitter){

      this.emitter = emitter;

      angular.module('GUI', []).controller('GUIController', ['$scope', function($scope){

          $scope.notes = [];
          $scope.velocities = [];

          emitter.on('midiready', function(midiDevices){
              $scope.$apply(function(){
                  $scope.midiDevices = midiDevices;
              });
          });

          //--------------------------------------------------

          emitter.on('midinoteon', function(message){
              $scope.$apply(function(){
                  let index = $scope.midiDevices.indexOf(message.device);
                  $scope.notes[index] = message.note;
                  $scope.velocities[index] = message.velocity;
              });
          });

          //--------------------------------------------------

          emitter.on('audiosource-detected', function(source){
            $scope.$apply(function(){
                $scope.audioSourceName = source;
            });
          });

          //--------------------------------------------------

          emitter.on('gotaudiostream', function(data){
            $scope.$apply(function(){
                $scope.bufferSize = data.bufferSize;
            });
          });

          //--------------------------------------------------

          $scope.reload = function(){
            location.reload();
          };

      }]);
    }
}
