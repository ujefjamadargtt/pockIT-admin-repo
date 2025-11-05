import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailServiceConfigComponent } from './email-service-config.component';

describe('EmailServiceConfigComponent', () => {
  let component: EmailServiceConfigComponent;
  let fixture: ComponentFixture<EmailServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
