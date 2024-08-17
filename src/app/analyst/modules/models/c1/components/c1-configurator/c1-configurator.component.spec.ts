import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1ConfiguratorComponent } from './c1-configurator.component';

describe('C1ConfiguratorComponent', () => {
  let component: C1ConfiguratorComponent;
  let fixture: ComponentFixture<C1ConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ C1ConfiguratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C1ConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
