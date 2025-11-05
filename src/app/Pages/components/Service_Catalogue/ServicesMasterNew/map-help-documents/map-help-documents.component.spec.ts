import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHelpDocumentsComponent } from './map-help-documents.component';

describe('MapHelpDocumentsComponent', () => {
  let component: MapHelpDocumentsComponent;
  let fixture: ComponentFixture<MapHelpDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapHelpDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapHelpDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
