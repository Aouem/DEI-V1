import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Arbredecause } from './arbredecause';

describe('Arbredecause', () => {
  let component: Arbredecause;
  let fixture: ComponentFixture<Arbredecause>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Arbredecause]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Arbredecause);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
