import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultIndexComponent } from './result-index.component';

describe('ResultIndexComponent', () => {
  let component: ResultIndexComponent;
  let fixture: ComponentFixture<ResultIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
