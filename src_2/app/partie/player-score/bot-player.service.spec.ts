import { TestBed } from '@angular/core/testing';

import { BotPlayerService } from './bot-player.service';

describe('BotPlayerService', () => {
  let service: BotPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
