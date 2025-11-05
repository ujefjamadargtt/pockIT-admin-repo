import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseterriorymappingComponent } from './warehouseterriorymapping.component';

describe('WarehouseterriorymappingComponent', () => {
  let component: WarehouseterriorymappingComponent;
  let fixture: ComponentFixture<WarehouseterriorymappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseterriorymappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseterriorymappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
