import { Component, Input, OnInit } from "@angular/core";

type Position = "row" | "column";
type Pivotable<T> = T[];
type Filter<T> = { [key: string]: any } & Partial<T>;
interface Field {
    key: string;
    name: string;
}
interface Segment<T> {
    fields: Field[];
    filter: Filter<T>;
    data: Set<{ [key: string]: any }>;
}

@Component({
    selector: "arion-pivot-table",
    templateUrl: "./pivot-table.component.html",
    styleUrls: ["./pivot-table.component.scss"]
})
export class PivotTableComponent implements OnInit {
    @Input() data: Pivotable<unknown> | undefined;
    @Input() groupBy: { [key in Position]: Field[] } = { row: [], column: [] };
    @Input() value: Field = {} as Field;
    @Input() operation: "avg" | "sum" | "count" = "sum";
    output: number[][] | undefined;
    segments: { [key in Position]: Segment<unknown>[] } = { row: [], column: [] };

    ngOnInit(): void {
        this.populate();
    }

    populate() {
        if (this.data) {
            // flatten the data so that we don't have to deal with nested objects
            let flattenedData = JSON.parse(JSON.stringify(this.data));
            flattenedData = flattenedData.map((row: any) => this._flattenJSON(row));
            // group the data
            for (let i = 0; i < flattenedData.length; i++) {
                // work through all the group definitions by position
                const positions = Object.keys(this.groupBy) as Position[];
                for (let position of positions) {
                    // for this position, get the fields that are used to group
                    const fields = this.groupBy[position];
                    if (fields) {
                        let filter: Filter<unknown> = {};
                        // set up the filter values for this row of data
                        for (let field of fields) {
                            filter = { ...filter, [field.key]: flattenedData[i][field.key] };
                        }
                        // check if we already have a group with this filter
                        let segment: Segment<unknown> | undefined = this.segments[position].find((g) => {
                            return JSON.stringify(g.filter) === JSON.stringify(filter);
                        });
                        if (!segment) {
                            // if not, create a new group
                            segment = {} as Segment<unknown>;
                            segment.fields = fields;
                            segment.filter = filter;
                            segment.data = new Set();
                            segment.data.add(flattenedData[i]);
                            this.segments[position].push(segment);
                        } else {
                            // if yes, add this row to the group
                            segment.data.add(flattenedData[i]);
                        }
                    }
                }
            }
            // sort the groups
            const positions = Object.keys(this.segments) as Position[];
            for (let position of positions) {
                this.segments[position] = this.segments[position].sort((a, b) => {
                    // order of sort given by array
                    let fields: Field[] = a.fields;
                    let orderBitsA: number = 0;
                    let orderBitsB: number = 0;
                    for (let field of fields) {
                        // compare the fields in the order they were given
                        switch (typeof a.filter[field.key]) {
                            case "string": {
                                orderBitsA += a.filter[field.key].localeCompare(b.filter[field.key]);
                                orderBitsB -= a.filter[field.key].localeCompare(b.filter[field.key]);
                                break;
                            }
                            default: {
                                if (a.filter[field.key] > b.filter[field.key]) {
                                    orderBitsA += 1;
                                    orderBitsB -= 1;
                                } else {
                                    orderBitsA -= 1;
                                    orderBitsB += 1;
                                }
                                break;
                            }
                        }
                        orderBitsA *= 10;
                        orderBitsB *= 10;
                    }
                    return orderBitsA - orderBitsB;
                });
            }
        }
    }

    calculateField(rowSegment: Segment<unknown>, columnSegment: Segment<unknown>): number {
        // get the relevant dataset by intersecting the row and column segments
        let intersection = new Set([...rowSegment.data].filter((x) => columnSegment.data.has(x)));
        let value = 0;
        let count = 0;
        for (let row of intersection) {
            switch(this.operation) {
                case "avg": {
                    value += row[this.value.key];
                    count += 1;
                    break;
                }
                case "sum": {
                    value += row[this.value.key];
                    break;
                }
                case "count": {
                    value += 1;
                    break;
                }
            }
        }
        if (this.operation === "avg") {
            value /= count;
        }
        return value;
    }

    private _flattenJSON(obj: { [key: string]: any }, keyPrefix: string = ""): unknown {
        // flattens a nested object recursively
        if (typeof obj !== "object" || obj === null || obj === undefined) {
            return obj;
        } else {
            const flattened: { [key: string]: any } = {};
            Object.keys(obj).forEach((key) => {
                const value = obj[key];
                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    Object.assign(flattened, this._flattenJSON(value, keyPrefix + key + "."));
                } else {
                    flattened[keyPrefix + key] = value;
                }
            });
            return flattened;
        }
    }
}
