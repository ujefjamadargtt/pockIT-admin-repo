import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupwiseautocloseticketcountComponent } from './groupwiseautocloseticketcount.component';

describe('GroupwiseautocloseticketcountComponent', () => {
  let component: GroupwiseautocloseticketcountComponent;
  let fixture: ComponentFixture<GroupwiseautocloseticketcountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupwiseautocloseticketcountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupwiseautocloseticketcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
