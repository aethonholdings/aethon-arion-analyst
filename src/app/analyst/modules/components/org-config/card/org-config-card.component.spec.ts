import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgConfigCardComponent } from './org-config-card.component';

describe('OrgConfigCardComponent', () => {
  let component: OrgConfigCardComponent;
  let fixture: ComponentFixture<OrgConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgConfigCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
