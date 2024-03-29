import { Injectable, effect, signal } from '@angular/core';
import { Turn } from 'src/app/data/reversi.definitions';
import { whereCanPlay } from 'src/app/data/reversi.game';
import { ReversiService } from 'src/app/partie/reversi.service';

@Injectable({
  providedIn: 'root'
})
export class BotPlayerService {
  private player = signal< Turn | undefined>(undefined);
  private isActivated = signal<boolean>(false);

  constructor(private readonly reversiService: ReversiService) {
    effect(() => {
      const gs = this.reversiService.sigGameState();
      this.play(gs.turn)
    }
      // , { allowSignalWrites: true }
    );
  }

  play(player: Turn): void {
    if (this.isActivated() && player == this.player()) {
      const possibilities = [...whereCanPlay(this.reversiService.sigGameState())];
      if (possibilities.length != 0) {
        const rand =  Math.floor(Math.random() * possibilities.length);
        
        setTimeout(() => {
          this.reversiService.play(possibilities[rand]);
          console.log(this.player()+' a joué ['+possibilities[rand]+']');
        }, 500); // Attends 0.5 seconde pour jouer
      }
    }
  }

  /**
   * Permet de déclarer que l'IA joue en tant que joueur player
   * @param player Le joueur que l'IA doit simuler
   */
  playAs(player: Turn | "nobody"): void {
    this.isActivated.set(player !== "nobody");
    this.player.set(player === "nobody" ? undefined : player);
  }
}
