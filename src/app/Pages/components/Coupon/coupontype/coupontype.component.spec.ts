import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupontypeComponent } from './coupontype.component';

describe('CoupontypeComponent', () => {
  let component: CoupontypeComponent;
  let fixture: ComponentFixture<CoupontypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoupontypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoupontypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
