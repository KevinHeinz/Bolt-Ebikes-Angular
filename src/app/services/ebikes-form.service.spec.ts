import { TestBed } from '@angular/core/testing';

import { EbikesFormService } from './ebikes-form.service';

describe('EbikesFormService', () => {
  let service: EbikesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbikesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
