import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReschedulejobrequestComponent } from './reschedulejobrequest.component';

describe('ReschedulejobrequestComponent', () => {
  let component: ReschedulejobrequestComponent;
  let fixture: ComponentFixture<ReschedulejobrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReschedulejobrequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReschedulejobrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
