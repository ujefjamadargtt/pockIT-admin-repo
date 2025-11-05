import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerconfigComponent } from './customerconfig.component';

describe('CustomerconfigComponent', () => {
  let component: CustomerconfigComponent;
  let fixture: ComponentFixture<CustomerconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
