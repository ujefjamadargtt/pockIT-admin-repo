import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupontypesComponent } from './coupontypes.component';

describe('CoupontypesComponent', () => {
  let component: CoupontypesComponent;
  let fixture: ComponentFixture<CoupontypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupontypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupontypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
