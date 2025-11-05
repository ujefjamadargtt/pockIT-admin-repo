import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMasterComponent } from './support-master.component';

describe('SupportMasterComponent', () => {
  let component: SupportMasterComponent;
  let fixture: ComponentFixture<SupportMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
