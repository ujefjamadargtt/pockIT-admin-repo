import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCompletionpopupComponent } from './job-completionpopup.component';

describe('JobCompletionpopupComponent', () => {
  let component: JobCompletionpopupComponent;
  let fixture: ComponentFixture<JobCompletionpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCompletionpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCompletionpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
