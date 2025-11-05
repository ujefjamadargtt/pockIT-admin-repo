import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServicesMappingListComponent } from './customer-services-mapping-list.component';

describe('CustomerServicesMappingListComponent', () => {
  let component: CustomerServicesMappingListComponent;
  let fixture: ComponentFixture<CustomerServicesMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServicesMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServicesMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
