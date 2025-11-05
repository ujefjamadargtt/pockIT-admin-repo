import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewknowledgebasecategoryComponent } from './newknowledgebasecategory.component';

describe('NewknowledgebasecategoryComponent', () => {
  let component: NewknowledgebasecategoryComponent;
  let fixture: ComponentFixture<NewknowledgebasecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewknowledgebasecategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewknowledgebasecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
