import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetailsdrawerComponent } from './orderdetailsdrawer.component';

describe('OrderdetailsdrawerComponent', () => {
  let component: OrderdetailsdrawerComponent;
  let fixture: ComponentFixture<OrderdetailsdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdetailsdrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderdetailsdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
