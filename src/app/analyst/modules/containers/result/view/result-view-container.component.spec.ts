import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultViewContainerComponent } from './result-view-container.component';

describe('ResultViewContainerComponent', () => {
  let component: ResultViewContainerComponent;
  let fixture: ComponentFixture<ResultViewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultViewContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
