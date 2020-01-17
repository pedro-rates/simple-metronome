import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  private audioContext = new (window['AudioContext'] || window['webkitAudioContext'])();
  private gainNode = this.audioContext.createGain();
  private timerWorker = null;
  private lookahead : number = 0.1;
  private noteLength : number = 0.05;
  private tempo : number = 60;
  private nextNoteTime : number = 0;
  private current16thNote : number = 0;
  private scheduleAheadTime : number = 0.1;

  private playing : boolean = false;

  public play(freq, time, delay) {
    // const oscillator = this.audioCtx.createOscillator();
    // oscillator.connect(this.gainNode);
    // this.gainNode.connect(this.audioCtx.destination);
    // oscillator.type = 'sine'; 
    // oscillator.frequency.value = freq;
    // this.playing = true;
    // while(this.playing) {
    //   oscillator.start(this.audioCtx.currentTime + delay);
    //   oscillator.stop(this.audioCtx.currentTime + delay + time);
    // }
    this.timerWorker.postMessage('start');
  }

  public stop() {
    this.playing = false;
    this.timerWorker.postMessage('stop');
  }

  public scheduler() {
    if(this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime)
      this.nextNote();
    }
  }

  public scheduleNote(beatNumber, time) {
    var osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    if (beatNumber % 16 === 0)    // beat 0 == high pitch
        osc.frequency.value = 880.0;
    else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
        osc.frequency.value = 440.0;
    else                        // other 16th notes = low pitch
        osc.frequency.value = 220.0;

    osc.start(time);
    osc.stop(time + this.noteLength);
  }

  public nextNote() {
       // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / this.tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
   this. nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    this.current16thNote++;    // Advance the beat number, wrap to zero
    if (this.current16thNote == 16) {
        this.current16thNote = 0;
    }
  }

  public init() {
    if (typeof Worker !== 'undefined') {
      this.timerWorker = new Worker('./metronome.worker', { type: 'module' });

      this.timerWorker.onmessage = (message) => {
        if (message.data == "tick") {
            this.scheduler();
        } else {
          console.log("message: " + message.data);
        }
      };

     this.timerWorker.postMessage({'interval' : this.lookahead });
    } else {
      console.log('Worker not supported.');
    }
  }
}
