import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannermasterlistComponent } from './bannermasterlist.component';

describe('BannermasterlistComponent', () => {
  let component: BannermasterlistComponent;
  let fixture: ComponentFixture<BannermasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannermasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannermasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
