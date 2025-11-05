import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bsubServiceFormComponent } from './b2bsub-service-form.component';

describe('B2bsubServiceFormComponent', () => {
  let component: B2bsubServiceFormComponent;
  let fixture: ComponentFixture<B2bsubServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2bsubServiceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bsubServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
