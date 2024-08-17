import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1ResultComponent } from './c1-result.component';

describe('C1ResultComponent', () => {
  let component: C1ResultComponent;
  let fixture: ComponentFixture<C1ResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1ResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
