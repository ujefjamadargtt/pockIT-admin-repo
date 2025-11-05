import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryCalendarComponent } from './territory-calendar.component';

describe('TerritoryCalendarComponent', () => {
  let component: TerritoryCalendarComponent;
  let fixture: ComponentFixture<TerritoryCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerritoryCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
