import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetCreateContainerComponent } from './sim-set-create-container.component';

describe('SimSetCreateContainerComponent', () => {
  let component: SimSetCreateContainerComponent;
  let fixture: ComponentFixture<SimSetCreateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetCreateContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetCreateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
