import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainorderComponent } from './mainorder.component';

describe('MainorderComponent', () => {
  let component: MainorderComponent;
  let fixture: ComponentFixture<MainorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
