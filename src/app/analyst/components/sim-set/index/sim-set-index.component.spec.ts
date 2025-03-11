import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetIndexComponent } from './sim-set-index.component';

describe('SimSetIndexComponent', () => {
  let component: SimSetIndexComponent;
  let fixture: ComponentFixture<SimSetIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
