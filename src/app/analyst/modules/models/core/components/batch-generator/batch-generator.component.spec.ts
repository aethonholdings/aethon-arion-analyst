import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchGeneratorComponent } from './batch-generator.component';

describe('BatchGeneratorComponent', () => {
  let component: BatchGeneratorComponent;
  let fixture: ComponentFixture<BatchGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
