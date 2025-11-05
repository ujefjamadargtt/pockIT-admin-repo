import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareedcomComponent } from './shareedcom.component';

describe('ShareedcomComponent', () => {
  let component: ShareedcomComponent;
  let fixture: ComponentFixture<ShareedcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareedcomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareedcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
