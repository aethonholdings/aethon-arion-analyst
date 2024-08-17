import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSetViewComponent } from './result-set-view.component';

describe('ResultSetViewComponent', () => {
  let component: ResultSetViewComponent;
  let fixture: ComponentFixture<ResultSetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultSetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultSetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
