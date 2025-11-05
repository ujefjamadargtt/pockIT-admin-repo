import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMasterFormComponent } from './brand-master-form.component';

describe('BrandMasterFormComponent', () => {
  let component: BrandMasterFormComponent;
  let fixture: ComponentFixture<BrandMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
