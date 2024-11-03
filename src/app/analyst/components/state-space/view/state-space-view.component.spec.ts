import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StateSpaceViewComponent } from "./state-space-view.component";

describe("StateSpaceViewComponent", () => {
    let component: StateSpaceViewComponent;
    let fixture: ComponentFixture<StateSpaceViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StateSpaceViewComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StateSpaceViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
