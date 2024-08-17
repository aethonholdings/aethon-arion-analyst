import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetViewContainerComponent } from './sim-set-view-container.component';

describe('SimSetViewContainerComponent', () => {
  let component: SimSetViewContainerComponent;
  let fixture: ComponentFixture<SimSetViewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetViewContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
