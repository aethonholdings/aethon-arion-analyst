import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1ResultSetComponent } from './c1-result-set.component';

describe('C1ResultSetComponent', () => {
  let component: C1ResultSetComponent;
  let fixture: ComponentFixture<C1ResultSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1ResultSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1ResultSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
