import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetViewComponent } from './sim-set-view.component';

describe('SimSetViewComponent', () => {
  let component: SimSetViewComponent;
  let fixture: ComponentFixture<SimSetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
