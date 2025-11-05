import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechconfigrationComponent } from './techconfigration.component';

describe('TechconfigrationComponent', () => {
  let component: TechconfigrationComponent;
  let fixture: ComponentFixture<TechconfigrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechconfigrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechconfigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
