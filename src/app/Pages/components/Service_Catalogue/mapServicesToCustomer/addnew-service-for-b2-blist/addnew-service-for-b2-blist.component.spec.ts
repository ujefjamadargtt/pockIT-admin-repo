import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewServiceForB2BListComponent } from './addnew-service-for-b2-blist.component';

describe('AddnewServiceForB2BListComponent', () => {
  let component: AddnewServiceForB2BListComponent;
  let fixture: ComponentFixture<AddnewServiceForB2BListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewServiceForB2BListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewServiceForB2BListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
