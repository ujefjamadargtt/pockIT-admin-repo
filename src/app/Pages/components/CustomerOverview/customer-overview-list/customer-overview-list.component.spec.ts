import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOverviewListComponent } from './customer-overview-list.component';

describe('CustomerOverviewListComponent', () => {
  let component: CustomerOverviewListComponent;
  let fixture: ComponentFixture<CustomerOverviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerOverviewListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOverviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
