import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordDeclarant } from './dashbord-declarant';

describe('DashbordDeclarant', () => {
  let component: DashbordDeclarant;
  let fixture: ComponentFixture<DashbordDeclarant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashbordDeclarant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordDeclarant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
