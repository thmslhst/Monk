'use strict';

// th0maslh0est

const EventEmitter = require('wolfy87-eventemitter');
const SoundInjecter = require('./js/sound-injecter').SoundInjecter;
const MIDIInjecter = require('./js/midi-injecter').MIDIInjecter;
const GUI = require('./js/gui').GUI;

//------------------------------------------

const emitter = new EventEmitter();
const soundInjecter = new SoundInjecter(emitter);
const midiInjecter = new MIDIInjecter(emitter);
const gui = new GUI(emitter);
