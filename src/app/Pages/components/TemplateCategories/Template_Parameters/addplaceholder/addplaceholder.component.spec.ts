import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddplaceholderComponent } from './addplaceholder.component';

describe('AddplaceholderComponent', () => {
  let component: AddplaceholderComponent;
  let fixture: ComponentFixture<AddplaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddplaceholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddplaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
