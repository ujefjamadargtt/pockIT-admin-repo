import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsDrawerMainComponent } from './add-details-drawer-main.component';

describe('AddDetailsDrawerMainComponent', () => {
  let component: AddDetailsDrawerMainComponent;
  let fixture: ComponentFixture<AddDetailsDrawerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsDrawerMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsDrawerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
