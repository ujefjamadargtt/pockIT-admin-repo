import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubServiceListComponent } from './sub-service-list.component';

describe('SubServiceListComponent', () => {
  let component: SubServiceListComponent;
  let fixture: ComponentFixture<SubServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
