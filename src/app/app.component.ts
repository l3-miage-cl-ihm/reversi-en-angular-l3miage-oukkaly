import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { Matrix, initMatrix, toMatrix } from './data/utils';
import { Board, BoardtoString, GameState, TileCoords, Turn, cToString } from './data/reversi.definitions';
import { produce } from 'immer';
import { whereCanPlay } from './data/reversi.game';
import { ReversiService } from './reversi.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {

  // à compléter
  userInput: TileCoords = [0,0];
  strBoard: Signal<string>;
  gameStateAll : Signal<GameStateAll> ;
  winnerSig: Signal<undefined | "Drawn" | Turn> ;
  scoresSig: Signal<Readonly<{ Player1: number, Player2: number }>>
  playableSig: Signal<Matrix<boolean, 8,8>> ;
  readonly coupsPossibles: Signal<readonly TileCoords[]>;

  constructor(private gameService : ReversiService){
    this.strBoard = computed( () => BoardtoString(this.gameService.sigGameState().board)); // good
    
    this.coupsPossibles = computed(
      () => whereCanPlay( this.gameService.sigGameState() )
    ); // good
    this.winnerSig = computed( () => {
      return this.coupsPossibles.length === 0 ? this.isDraw() : undefined ;
    }
    ); // a implémenter

    this.scoresSig = computed( () => ({Player1: 2 , Player2: 2})); // good

    this.playableSig = computed( () => {
      const resMatrix = initMatrix(() => false, 8,8);
      const isPlayable = produce( resMatrix, mutableMatrice => {        
        //coupsPossibles() => une liste de coord (i , j)
        this.coupsPossibles().map( x => {
          mutableMatrice[x[0]][x[1]] = true;
        });
        // Vous devrez utiliser la fonction whereCanPlay pour savoir quelles cases de la matrice doivent être marquées comme true (jouables)
      });
    
      return isPlayable;

    });

    
    this.gameStateAll = computed<GameStateAll>( () => ({
      gameState: this.gameService.sigGameState(),
      listPlayable: this.coupsPossibles(),
      isPlayable: this.playableSig() ,
      scores: this.scoresSig(),
      boardString: this.strBoard(),
      winner: this.winnerSig()
    }));

  }
  affichageCoordonee(){
    this.gameService.play(this.userInput);
  }
  affichageBoard(){
    return BoardtoString(this.gameService.sigGameState().board);
  }
  currentPlayer(){
    const player = this.gameService.sigGameState().turn ;
    return cToString(player)+": "+player;
  }
  playAt(coor: TileCoords) {
    this.gameService.play(coor);
  }

  exist(coor : TileCoords , coorGiven: TileCoords[] ): boolean{
    let i = 0 ;
    while( i < coorGiven.length &&  coor !== coorGiven[i] ){
      i++;
    } 
    return i < coorGiven.length ;
  }

isDraw(): "Drawn" | Turn {
  return this.scoresSig().Player1 === this.scoresSig().Player2 ? "Drawn" : this.whoWins() ;
}  
  whoWins(): Turn {
      // regarder le score 
      return this.scoresSig().Player1 > this.scoresSig().Player2  ?'Player1' : 'Player2'; 
  }

}


export interface GameStateAll {
  readonly gameState: GameState;
  readonly listPlayable: readonly TileCoords[];
  readonly isPlayable: Matrix<boolean, 8, 8>;
  readonly scores: Readonly<{ Player1: number, Player2: number }>;
  readonly boardString: string;
  readonly winner: undefined | "Drawn" | Turn;
}