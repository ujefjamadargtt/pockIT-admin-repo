import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobassigndrawerComponent } from './jobassigndrawer.component';

describe('JobassigndrawerComponent', () => {
  let component: JobassigndrawerComponent;
  let fixture: ComponentFixture<JobassigndrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobassigndrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobassigndrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
