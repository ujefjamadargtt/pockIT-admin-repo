import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertoTechStockMoveDrawerComponent } from './customerto-tech-stock-move-drawer.component';

describe('CustomertoTechStockMoveDrawerComponent', () => {
  let component: CustomertoTechStockMoveDrawerComponent;
  let fixture: ComponentFixture<CustomertoTechStockMoveDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomertoTechStockMoveDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomertoTechStockMoveDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
