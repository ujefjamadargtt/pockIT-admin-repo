import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertoTechStockMoveListComponent } from './customerto-tech-stock-move-list.component';

describe('CustomertoTechStockMoveListComponent', () => {
  let component: CustomertoTechStockMoveListComponent;
  let fixture: ComponentFixture<CustomertoTechStockMoveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomertoTechStockMoveListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomertoTechStockMoveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
