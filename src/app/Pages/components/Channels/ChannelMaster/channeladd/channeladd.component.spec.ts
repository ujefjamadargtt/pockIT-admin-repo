import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanneladdComponent } from './channeladd.component';

describe('ChanneladdComponent', () => {
  let component: ChanneladdComponent;
  let fixture: ComponentFixture<ChanneladdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChanneladdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChanneladdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
