import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchfaqComponent } from './searchfaq.component';

describe('SearchfaqComponent', () => {
  let component: SearchfaqComponent;
  let fixture: ComponentFixture<SearchfaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchfaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
