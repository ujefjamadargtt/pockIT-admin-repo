import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerconfigsComponent } from './customerconfigs.component';

describe('CustomerconfigsComponent', () => {
  let component: CustomerconfigsComponent;
  let fixture: ComponentFixture<CustomerconfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerconfigsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerconfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
