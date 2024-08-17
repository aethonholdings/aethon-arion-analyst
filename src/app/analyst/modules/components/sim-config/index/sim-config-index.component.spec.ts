import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimConfigIndexComponent } from './sim-config-index.component';

describe('SimConfigsComponent', () => {
  let component: SimConfigIndexComponent;
  let fixture: ComponentFixture<SimConfigIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimConfigIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimConfigIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
