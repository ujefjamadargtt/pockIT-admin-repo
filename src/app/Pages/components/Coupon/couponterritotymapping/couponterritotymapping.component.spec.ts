import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponterritotymappingComponent } from './couponterritotymapping.component';

describe('CouponterritotymappingComponent', () => {
  let component: CouponterritotymappingComponent;
  let fixture: ComponentFixture<CouponterritotymappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponterritotymappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponterritotymappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
