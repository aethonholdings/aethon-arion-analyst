import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetComponent } from './sim-set.component';

describe('SimSetComponent', () => {
  let component: SimSetComponent;
  let fixture: ComponentFixture<SimSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
