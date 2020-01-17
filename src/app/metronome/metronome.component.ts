import { Component, OnInit } from '@angular/core';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.css']
})
export class MetronomeComponent implements OnInit {

  constructor(private soundService : SoundService) { }

  ngOnInit() {
    this.soundService.init();
  }

  playSound() {
    this.soundService.play(440, 0.1, 0);
  }

  stopSound() {
    this.soundService.stop();
  }

}
