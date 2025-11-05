import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustaddComponent } from './custadd.component';

describe('CustaddComponent', () => {
  let component: CustaddComponent;
  let fixture: ComponentFixture<CustaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
