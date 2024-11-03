import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { GraphService } from "../../services/graph.service";
import * as cytoscape from "cytoscape";

@Component({
    selector: "arion-graph",
    templateUrl: "./graph.component.html",
    styleUrls: ["./graph.component.scss"]
})
export class GraphComponent implements OnInit, AfterViewInit {
    @ViewChild("graphElement") graphElement!: ElementRef<HTMLDivElement>;
    @Input() influenceTensor: number[][][][] = [];
    @Input() states: number[][] = [];
    cytoscape: cytoscape.Core = {} as cytoscape.Core;
    elements: cytoscape.ElementsDefinition = {} as cytoscape.ElementsDefinition;

    constructor(private graphService: GraphService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const cytoscape = require("cytoscape");
        const coseBilkent = require("cytoscape-cose-bilkent");
        cytoscape.use(coseBilkent);
        this.elements = this.graphService.generateGraphElements(this.influenceTensor);
        this.cytoscape = cytoscape({
            elements: this.elements,
            container: this.graphElement.nativeElement,
            layout: {
                name: "cose-bilkent",
                animate: false
            },
            style: [
                { selector: "node", style: { width: "10px", height: "10px" } },
                { selector: "edge", style: { width: "1px" } }
            ]
        });
        this.cytoscape.zoomingEnabled(false);
        this.cytoscape.userZoomingEnabled(false);
    }
}
