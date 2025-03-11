import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimConfigViewComponent } from './sim-config-view.component';

describe('SimConfigViewComponent', () => {
  let component: SimConfigViewComponent;
  let fixture: ComponentFixture<SimConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimConfigViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
