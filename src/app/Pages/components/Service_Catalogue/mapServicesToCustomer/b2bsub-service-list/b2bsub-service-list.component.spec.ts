import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bsubServiceListComponent } from './b2bsub-service-list.component';

describe('B2bsubServiceListComponent', () => {
  let component: B2bsubServiceListComponent;
  let fixture: ComponentFixture<B2bsubServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2bsubServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bsubServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
