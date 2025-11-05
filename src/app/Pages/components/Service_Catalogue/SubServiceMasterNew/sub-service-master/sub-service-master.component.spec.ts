import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubServiceMasterComponent } from './sub-service-master.component';

describe('SubServiceMasterComponent', () => {
  let component: SubServiceMasterComponent;
  let fixture: ComponentFixture<SubServiceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubServiceMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
