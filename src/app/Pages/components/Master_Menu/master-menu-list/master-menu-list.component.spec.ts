import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterMenuListComponent } from './master-menu-list.component';

describe('MasterMenuListComponent', () => {
  let component: MasterMenuListComponent;
  let fixture: ComponentFixture<MasterMenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterMenuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
