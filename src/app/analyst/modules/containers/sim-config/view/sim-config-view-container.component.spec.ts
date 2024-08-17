import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimConfigViewContainerComponent } from './sim-config-view-container.component';

describe('SimConfigViewContainerComponent', () => {
  let component: SimConfigViewContainerComponent;
  let fixture: ComponentFixture<SimConfigViewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimConfigViewContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimConfigViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
