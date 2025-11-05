import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTerritoryMappingComponent } from './vendor-territory-mapping.component';

describe('VendorTerritoryMappingComponent', () => {
  let component: VendorTerritoryMappingComponent;
  let fixture: ComponentFixture<VendorTerritoryMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTerritoryMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorTerritoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
