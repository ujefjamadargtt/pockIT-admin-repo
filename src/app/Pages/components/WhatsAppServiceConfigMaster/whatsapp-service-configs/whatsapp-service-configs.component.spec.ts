import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappServiceConfigsComponent } from './whatsapp-service-configs.component';

describe('WhatsappServiceConfigsComponent', () => {
  let component: WhatsappServiceConfigsComponent;
  let fixture: ComponentFixture<WhatsappServiceConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappServiceConfigsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappServiceConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
