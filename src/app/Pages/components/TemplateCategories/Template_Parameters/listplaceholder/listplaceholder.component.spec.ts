import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListplaceholderComponent } from './listplaceholder.component';

describe('ListplaceholderComponent', () => {
  let component: ListplaceholderComponent;
  let fixture: ComponentFixture<ListplaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListplaceholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListplaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
