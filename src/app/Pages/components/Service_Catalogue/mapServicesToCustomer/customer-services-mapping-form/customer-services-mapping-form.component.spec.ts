import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServicesMappingFormComponent } from './customer-services-mapping-form.component';

describe('CustomerServicesMappingFormComponent', () => {
  let component: CustomerServicesMappingFormComponent;
  let fixture: ComponentFixture<CustomerServicesMappingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServicesMappingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServicesMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
