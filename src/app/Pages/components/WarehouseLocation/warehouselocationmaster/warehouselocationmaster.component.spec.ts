import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouselocationmasterComponent } from './warehouselocationmaster.component';

describe('WarehouselocationmasterComponent', () => {
  let component: WarehouselocationmasterComponent;
  let fixture: ComponentFixture<WarehouselocationmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouselocationmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouselocationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
