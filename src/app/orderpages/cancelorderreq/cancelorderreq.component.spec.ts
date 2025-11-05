import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelorderreqComponent } from './cancelorderreq.component';

describe('CancelorderreqComponent', () => {
  let component: CancelorderreqComponent;
  let fixture: ComponentFixture<CancelorderreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelorderreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelorderreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
