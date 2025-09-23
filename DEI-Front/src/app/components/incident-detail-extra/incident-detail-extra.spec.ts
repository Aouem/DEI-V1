import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailExtra } from './incident-detail-extra';

describe('IncidentDetailExtra', () => {
  let component: IncidentDetailExtra;
  let fixture: ComponentFixture<IncidentDetailExtra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentDetailExtra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDetailExtra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
