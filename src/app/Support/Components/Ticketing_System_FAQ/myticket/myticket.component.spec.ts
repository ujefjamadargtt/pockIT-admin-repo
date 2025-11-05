import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyticketComponent } from './myticket.component';

describe('MyticketComponent', () => {
  let component: MyticketComponent;
  let fixture: ComponentFixture<MyticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
