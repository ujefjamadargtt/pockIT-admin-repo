import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDrawerComponent } from './warehouse-drawer.component';

describe('WarehouseDrawerComponent', () => {
  let component: WarehouseDrawerComponent;
  let fixture: ComponentFixture<WarehouseDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
