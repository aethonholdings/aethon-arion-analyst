import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgConfigViewComponent } from './org-config-view.component';

describe('OrgConfigComponent', () => {
  let component: OrgConfigViewComponent;
  let fixture: ComponentFixture<OrgConfigViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgConfigViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
