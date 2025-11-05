import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsServiceConfigComponent } from './sms-service-config.component';

describe('SmsServiceConfigComponent', () => {
  let component: SmsServiceConfigComponent;
  let fixture: ComponentFixture<SmsServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
