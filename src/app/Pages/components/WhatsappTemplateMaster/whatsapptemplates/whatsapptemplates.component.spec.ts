import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsapptemplatesComponent } from './whatsapptemplates.component';

describe('WhatsapptemplatesComponent', () => {
  let component: WhatsapptemplatesComponent;
  let fixture: ComponentFixture<WhatsapptemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsapptemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsapptemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
