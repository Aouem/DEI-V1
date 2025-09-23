import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentForm } from './incident-form';

describe('IncidentForm', () => {
  let component: IncidentForm;
  let fixture: ComponentFixture<IncidentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
