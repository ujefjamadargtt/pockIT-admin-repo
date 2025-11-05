import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryTimeSlotsComponent } from './territory-time-slots.component';

describe('TerritoryTimeSlotsComponent', () => {
  let component: TerritoryTimeSlotsComponent;
  let fixture: ComponentFixture<TerritoryTimeSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryTimeSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerritoryTimeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
