import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobtrainingMasterDrawerComponent } from './jobtraining-master-drawer.component';

describe('JobtrainingMasterDrawerComponent', () => {
  let component: JobtrainingMasterDrawerComponent;
  let fixture: ComponentFixture<JobtrainingMasterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobtrainingMasterDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobtrainingMasterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
