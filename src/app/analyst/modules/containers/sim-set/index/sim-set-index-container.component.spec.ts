import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetIndexContainerComponent } from './sim-set-index-container.component';

describe('SimSetIndexContainerComponent', () => {
  let component: SimSetIndexContainerComponent;
  let fixture: ComponentFixture<SimSetIndexContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetIndexContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetIndexContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
