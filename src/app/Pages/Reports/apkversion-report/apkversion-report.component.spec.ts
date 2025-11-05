import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APKVersionReportComponent } from './apkversion-report.component';

describe('APKVersionReportComponent', () => {
  let component: APKVersionReportComponent;
  let fixture: ComponentFixture<APKVersionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ APKVersionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(APKVersionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
