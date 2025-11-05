import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTechnicainMapComponent } from './list-technicain-map.component';

describe('ListTechnicainMapComponent', () => {
  let component: ListTechnicainMapComponent;
  let fixture: ComponentFixture<ListTechnicainMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTechnicainMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTechnicainMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
