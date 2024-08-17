import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1BatchGeneratorComponent } from './c1-batch-generator.component';

describe('C1BatchGeneratorComponent', () => {
  let component: C1BatchGeneratorComponent;
  let fixture: ComponentFixture<C1BatchGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1BatchGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1BatchGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
