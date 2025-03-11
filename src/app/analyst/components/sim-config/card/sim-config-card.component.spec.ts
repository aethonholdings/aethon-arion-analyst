import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimConfigCardComponent } from './sim-config-card.component';

describe('SimConfigCardComponent', () => {
  let component: SimConfigCardComponent;
  let fixture: ComponentFixture<SimConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimConfigCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
