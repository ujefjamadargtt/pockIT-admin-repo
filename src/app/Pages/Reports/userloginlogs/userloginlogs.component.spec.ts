import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserloginlogsComponent } from './userloginlogs.component';

describe('UserloginlogsComponent', () => {
  let component: UserloginlogsComponent;
  let fixture: ComponentFixture<UserloginlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserloginlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserloginlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
