import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobtrainingMasterComponent } from './jobtraining-master.component';

describe('JobtrainingMasterComponent', () => {
  let component: JobtrainingMasterComponent;
  let fixture: ComponentFixture<JobtrainingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobtrainingMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobtrainingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
