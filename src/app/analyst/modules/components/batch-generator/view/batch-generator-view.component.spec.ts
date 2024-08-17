import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchGeneratorViewComponent } from './batch-generator-view.component';

describe('BatchGeneratorViewComponent', () => {
  let component: BatchGeneratorViewComponent;
  let fixture: ComponentFixture<BatchGeneratorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchGeneratorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchGeneratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
