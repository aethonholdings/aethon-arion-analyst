import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1PlantComponent } from './c1-plant.component';

describe('C1PlantComponent', () => {
  let component: C1PlantComponent;
  let fixture: ComponentFixture<C1PlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1PlantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1PlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
