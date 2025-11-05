import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappServiceConfigComponent } from './whatsapp-service-config.component';

describe('WhatsappServiceConfigComponent', () => {
  let component: WhatsappServiceConfigComponent;
  let fixture: ComponentFixture<WhatsappServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
