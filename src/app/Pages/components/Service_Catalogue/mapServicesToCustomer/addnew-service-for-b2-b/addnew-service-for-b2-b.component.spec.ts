import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewServiceForB2BComponent } from './addnew-service-for-b2-b.component';

describe('AddnewServiceForB2BComponent', () => {
  let component: AddnewServiceForB2BComponent;
  let fixture: ComponentFixture<AddnewServiceForB2BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewServiceForB2BComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewServiceForB2BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
