import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypewiseTransactionReportComponent } from './typewise-transaction-report.component';

describe('TypewiseTransactionReportComponent', () => {
  let component: TypewiseTransactionReportComponent;
  let fixture: ComponentFixture<TypewiseTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypewiseTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypewiseTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
