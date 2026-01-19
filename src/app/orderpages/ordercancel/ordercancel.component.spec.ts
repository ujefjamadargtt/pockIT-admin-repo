import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdercancelComponent } from './ordercancel.component';
describe('OrdercancelComponent', () => {
  let component: OrdercancelComponent;
  let fixture: ComponentFixture<OrdercancelComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdercancelComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(OrdercancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
