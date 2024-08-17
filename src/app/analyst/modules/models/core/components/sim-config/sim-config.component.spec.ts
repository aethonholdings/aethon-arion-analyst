import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimConfigComponent } from './sim-config.component';

describe('SimConfigComponent', () => {
  let component: SimConfigComponent;
  let fixture: ComponentFixture<SimConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
