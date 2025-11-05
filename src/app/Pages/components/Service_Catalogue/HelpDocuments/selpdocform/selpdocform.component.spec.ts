import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelpdocformComponent } from './selpdocform.component';

describe('SelpdocformComponent', () => {
  let component: SelpdocformComponent;
  let fixture: ComponentFixture<SelpdocformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelpdocformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelpdocformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
