import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercreatedrawerComponent } from './ordercreatedrawer.component';

describe('OrdercreatedrawerComponent', () => {
  let component: OrdercreatedrawerComponent;
  let fixture: ComponentFixture<OrdercreatedrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdercreatedrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdercreatedrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
