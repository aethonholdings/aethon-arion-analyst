import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1ReportingComponent } from './c1-reporting.component';

describe('C1ReportingComponent', () => {
  let component: C1ReportingComponent;
  let fixture: ComponentFixture<C1ReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1ReportingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1ReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
