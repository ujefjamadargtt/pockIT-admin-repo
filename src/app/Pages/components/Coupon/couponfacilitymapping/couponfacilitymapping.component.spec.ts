import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponfacilitymappingComponent } from './couponfacilitymapping.component';

describe('CouponfacilitymappingComponent', () => {
  let component: CouponfacilitymappingComponent;
  let fixture: ComponentFixture<CouponfacilitymappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponfacilitymappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponfacilitymappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
