import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSetTensorsComponent } from './agent-set-tensors.component';

describe('AgentSetTensorsComponent', () => {
  let component: AgentSetTensorsComponent;
  let fixture: ComponentFixture<AgentSetTensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSetTensorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentSetTensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
