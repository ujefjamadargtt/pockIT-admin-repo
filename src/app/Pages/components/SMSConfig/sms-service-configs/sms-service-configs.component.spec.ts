import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsServiceConfigsComponent } from './sms-service-configs.component';

describe('SmsServiceConfigsComponent', () => {
  let component: SmsServiceConfigsComponent;
  let fixture: ComponentFixture<SmsServiceConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsServiceConfigsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsServiceConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
