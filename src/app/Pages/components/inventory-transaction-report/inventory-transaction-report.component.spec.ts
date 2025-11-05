import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionReportComponent } from './inventory-transaction-report.component';

describe('InventoryTransactionReportComponent', () => {
  let component: InventoryTransactionReportComponent;
  let fixture: ComponentFixture<InventoryTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
