import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetCardComponent } from './sim-set-card.component';

describe('SimSetCardComponent', () => {
  let component: SimSetCardComponent;
  let fixture: ComponentFixture<SimSetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
