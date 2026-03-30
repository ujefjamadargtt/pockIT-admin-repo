import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListDrawerComponent } from './wallet-list-drawer.component';

describe('WalletListDrawerComponent', () => {
  let component: WalletListDrawerComponent;
  let fixture: ComponentFixture<WalletListDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletListDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletListDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
