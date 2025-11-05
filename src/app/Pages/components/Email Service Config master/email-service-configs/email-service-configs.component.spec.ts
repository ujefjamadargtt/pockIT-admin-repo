import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailServiceConfigsComponent } from './email-service-configs.component';

describe('EmailServiceConfigsComponent', () => {
  let component: EmailServiceConfigsComponent;
  let fixture: ComponentFixture<EmailServiceConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailServiceConfigsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailServiceConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
