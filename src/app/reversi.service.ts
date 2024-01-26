import { Injectable, WritableSignal, computed, signal, Signal } from '@angular/core';
import { ReversiModelInterface, GameState, TileCoords } from './data/reversi.definitions';
import { initialGameState, tryPlay } from './data/reversi.game';

@Injectable({
  providedIn: 'root'
})
export class ReversiService implements ReversiModelInterface {
  private readonly _sigGameState: WritableSignal<GameState> = signal<GameState>(initialGameState);
  public readonly sigGameState = computed<GameState>(() => this._sigGameState());
  play(coord: TileCoords) { 
    tryPlay(this.sigGameState(), coord[0], coord[1]);
   }
  restart() { this._sigGameState.update(() => initialGameState) }
  constructor() {}
}
