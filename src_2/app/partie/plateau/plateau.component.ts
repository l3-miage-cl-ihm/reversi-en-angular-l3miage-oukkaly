import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { GameStateAll } from '../partie.component';
import { C, TileCoords } from 'src/app/data/reversi.definitions';
import { IntRange, Vector } from 'src/app/data/utils';

@Component({
  selector: 'app-plateau',
  templateUrl: './plateau.component.html',
  styleUrls: ['./plateau.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlateauComponent {
  @Input({ required: true })
    gameState!: GameStateAll;

  @Input()
    canPlay: boolean = true;

  @Output()
    played = new EventEmitter<TileCoords>();

  readonly vector8: readonly IntRange<0, 8>[] =  [0, 1, 2, 3, 4, 5, 6, 7];

  // playDEBUG(c: [number, number]): void {
  //   this.play(c as TileCoords);
  // }

  play(coord: TileCoords): void {
    if (this.canPlay) {
      this.played.emit(coord);
    }
  }

  // trackByIndex<T>(index: number, v: T): number {
  //   return index;
  // }

}
