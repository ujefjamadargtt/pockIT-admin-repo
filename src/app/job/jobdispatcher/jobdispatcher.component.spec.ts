import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobdispatcherComponent } from './jobdispatcher.component';

describe('JobdispatcherComponent', () => {
  let component: JobdispatcherComponent;
  let fixture: ComponentFixture<JobdispatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobdispatcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobdispatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
