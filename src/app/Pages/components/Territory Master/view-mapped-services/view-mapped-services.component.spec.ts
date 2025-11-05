import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMappedServicesComponent } from './view-mapped-services.component';

describe('ViewMappedServicesComponent', () => {
  let component: ViewMappedServicesComponent;
  let fixture: ComponentFixture<ViewMappedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMappedServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMappedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
