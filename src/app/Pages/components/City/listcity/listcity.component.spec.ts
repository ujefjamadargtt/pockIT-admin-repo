import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcityComponent } from './listcity.component';

describe('ListcityComponent', () => {
  let component: ListcityComponent;
  let fixture: ComponentFixture<ListcityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListcityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListcityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
