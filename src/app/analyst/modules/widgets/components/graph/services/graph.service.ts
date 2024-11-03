import { Injectable } from "@angular/core";
import { ElementsDefinition, NodeDefinition, EdgeDefinition } from "cytoscape";

@Injectable({
    providedIn: "root"
})
export class GraphService {
    constructor() {}

    generateGraphElements(influenceMatrix: number[][][][]): ElementsDefinition {
        const elements: ElementsDefinition = {
            nodes: new Array<NodeDefinition>(),
            edges: new Array<EdgeDefinition>()
        } as ElementsDefinition;
        // need to check for size consistency of matrix and throw error if size is irregular
        for (let alpha = 0; alpha < influenceMatrix.length; alpha++) {
            elements.nodes.push({
                data: { id: alpha.toString() },
                selected: false,
                selectable: true,
                locked: false,
                grabbable: false,
                pannable: false
            } as NodeDefinition);
            for (let beta = 0; beta < influenceMatrix.length; beta++) {
                if (alpha !== beta && this._isNotNull(influenceMatrix[alpha][beta])) {
                    elements.edges.push({
                        data: { id: this.edgeId(alpha, beta), source: alpha.toString(), target: beta.toString() },
                        selected: false,
                        selectable: false,
                        locked: false,
                        grabbable: false,
                        pannable: false
                    } as EdgeDefinition);
                }
            }
        }
        return elements;
    }

    private _isNotNull(matrix: number[][]): boolean {
        let flag: boolean = true;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (matrix[i][j] === 0) flag = false;
            }
        }
        return flag;
    }

    edgeId(from: number, to: number): string {
        return "(" + from + "," + to + ")";
    }
}
