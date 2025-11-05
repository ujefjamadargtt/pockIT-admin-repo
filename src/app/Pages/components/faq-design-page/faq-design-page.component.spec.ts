import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQDesignPageComponent } from './faq-design-page.component';

describe('FAQDesignPageComponent', () => {
  let component: FAQDesignPageComponent;
  let fixture: ComponentFixture<FAQDesignPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQDesignPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQDesignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
