import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScoreComponent } from './player-score.component';

describe('PlayerScoreComponent', () => {
  let component: PlayerScoreComponent;
  let fixture: ComponentFixture<PlayerScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerScoreComponent]
    });
    fixture = TestBed.createComponent(PlayerScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
