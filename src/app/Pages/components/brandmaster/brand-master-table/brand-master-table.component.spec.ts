import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMasterTableComponent } from './brand-master-table.component';

describe('BrandMasterTableComponent', () => {
  let component: BrandMasterTableComponent;
  let fixture: ComponentFixture<BrandMasterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandMasterTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandMasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
