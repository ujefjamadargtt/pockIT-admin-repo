import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelpdoclistComponent } from './selpdoclist.component';

describe('SelpdoclistComponent', () => {
  let component: SelpdoclistComponent;
  let fixture: ComponentFixture<SelpdoclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelpdoclistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelpdoclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
