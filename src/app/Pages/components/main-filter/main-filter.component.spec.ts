import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFilterComponent } from './main-filter.component';

describe('MainFilterComponent', () => {
  let component: MainFilterComponent;
  let fixture: ComponentFixture<MainFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
