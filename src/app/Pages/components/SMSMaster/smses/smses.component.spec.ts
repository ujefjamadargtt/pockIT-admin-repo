import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsesComponent } from './smses.component';

describe('SmsesComponent', () => {
  let component: SmsesComponent;
  let fixture: ComponentFixture<SmsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
