import { Component, EventEmitter, Injector, Input, Output, Signal, effect } from '@angular/core';
import { GameStateAll } from '../partie.component';
import { Turn } from 'src/app/data/reversi.definitions';
import { BotPlayerService } from './bot-player.service';

@Component({
  selector: 'app-player-score',
  templateUrl: './player-score.component.html',
  styleUrls: ['./player-score.component.scss'],
  providers: [BotPlayerService]
})
export class PlayerScoreComponent {
  @Input({required: true})
    gameState!: GameStateAll;
  
  @Input({required: true})
    player!: Turn;

  _isActivated: boolean = false;

  @Output()
    activateAI = new EventEmitter<boolean>();

  constructor(private readonly botPlayerService: BotPlayerService) {}


  changeBotPlayerStatus(): void {
    this._isActivated = !this._isActivated;
    this.activateAI.emit(this._isActivated);
    
    this.botPlayerService.playAs(this._isActivated ? this.player : "nobody");
  }
  
}
