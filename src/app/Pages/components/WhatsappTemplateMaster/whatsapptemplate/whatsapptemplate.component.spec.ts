import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsapptemplateComponent } from './whatsapptemplate.component';

describe('WhatsapptemplateComponent', () => {
  let component: WhatsapptemplateComponent;
  let fixture: ComponentFixture<WhatsapptemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsapptemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsapptemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



