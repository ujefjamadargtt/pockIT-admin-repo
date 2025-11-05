import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbannermasterComponent } from './addbannermaster.component';

describe('AddbannermasterComponent', () => {
  let component: AddbannermasterComponent;
  let fixture: ComponentFixture<AddbannermasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbannermasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbannermasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
