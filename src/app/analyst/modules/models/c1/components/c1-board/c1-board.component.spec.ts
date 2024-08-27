import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1BoardComponent } from './c1-board.component';

describe('C1BoardComponent', () => {
  let component: C1BoardComponent;
  let fixture: ComponentFixture<C1BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1BoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
