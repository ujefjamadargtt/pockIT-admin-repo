import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouselocationformComponent } from './warehouselocationform.component';

describe('WarehouselocationformComponent', () => {
  let component: WarehouselocationformComponent;
  let fixture: ComponentFixture<WarehouselocationformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouselocationformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouselocationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
