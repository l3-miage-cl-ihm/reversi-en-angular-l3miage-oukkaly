import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { Matrix, initMatrix, toMatrix } from './data/utils';
import { Board, BoardtoString, GameState, TileCoords, Turn, cToString } from './data/reversi.definitions';
import { produce } from 'immer';
import { whereCanPlay } from './data/reversi.game';
import { ReversiService } from './reversi.service';
import { single } from 'rxjs';


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
  testSignal : Signal<number>;
  testSignalX : Signal<number>;

  constructor(private gameService : ReversiService){
    
    this.strBoard = computed( () => BoardtoString(this.gameService.sigGameState().board)); 

    this.testSignal = computed<number>( () => 
      this.gameService.sigGameState().board
      .reduce((acc,v)=> {
        return acc + v.reduce((acc2 , v2 ) => {
          console.log(v2==='Player1');
          return v2 === 'Player1' ? acc2 + 1 : acc2
        }, 0)
      },0));
    /*
    const boardV2 = computed( () => 
      this.gameService.sigGameState().board.forEach((x) => x.map((v) => v === "Player1" ));
    );     
    */

    this.testSignalX = computed<number>( () => this.gameService.sigGameState().board.reduce((acc,v)=> acc + v.reduce((acc2 , v2) => v2=== 'Player2' ? acc2 + 1 : acc2 , 0), 0));
    
    this.coupsPossibles = computed(
      () => whereCanPlay( this.gameService.sigGameState() ) 
    ); // good
    this.winnerSig = computed( () => {
      return this.coupsPossibles().length === 0 ? this.isDraw() : undefined ;
    }
    ); 
    this.scoresSig = computed( () => ({
      Player1: this.testSignal() ,
      Player2: this.testSignalX()
    })); // good
    
    this.playableSig = computed( () => {
      const resMatrix = initMatrix(() => false, 8,8);
      const isPlayable = produce( resMatrix, mutableMatrice => {        
        this.coupsPossibles().map( x => {
          mutableMatrice[x[0]][x[1]] = true;
        });
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
  currentPlayer(){
    const player = this.gameService.sigGameState().turn ;
    return cToString(player)+": "+player;
  }
  playAt(coor: TileCoords) {
    this.gameService.play(coor);
  }

  
  maMethodeX(): number{
    return this.gameService.sigGameState().board.reduce((acc,v)=> acc + v.reduce((acc2 , v2 , i2) => v2=== "Player1" ? acc2++ : acc2 , 0), 0);
  }
  maMethodeO(): number{
    return this.gameService.sigGameState().board.reduce((acc,v)=> acc + v.reduce((acc2 , v2 , i2) => v2=== "Player2" ? acc2++ : acc2 , 0), 0);
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