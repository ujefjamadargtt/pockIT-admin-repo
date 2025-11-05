import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListstateComponent } from './liststate.component';

describe('ListstateComponent', () => {
  let component: ListstateComponent;
  let fixture: ComponentFixture<ListstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListstateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
