import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceRatingComponent } from './view-service-rating.component';

describe('ViewServiceRatingComponent', () => {
  let component: ViewServiceRatingComponent;
  let fixture: ComponentFixture<ViewServiceRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewServiceRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServiceRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
