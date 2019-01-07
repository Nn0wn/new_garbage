import { TestBed } from '@angular/core/testing';

import { ComponentSyncService } from './component-sync.service';

describe('ComponentSyncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentSyncService = TestBed.get(ComponentSyncService);
    expect(service).toBeTruthy();
  });
});
