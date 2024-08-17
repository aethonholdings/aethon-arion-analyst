import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfiguratorCardComponent } from "./configurator-card.component";

describe("ConfiguratorViewComponent", () => {
    let component: ConfiguratorCardComponent;
    let fixture: ComponentFixture<ConfiguratorCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfiguratorCardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfiguratorCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
