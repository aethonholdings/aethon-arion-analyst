import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSetCreateComponent } from './sim-set-create.component';

describe('SimSetCreateComponent', () => {
  let component: SimSetCreateComponent;
  let fixture: ComponentFixture<SimSetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSetCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimSetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
