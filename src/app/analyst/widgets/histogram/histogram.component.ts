import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

@Component({
    selector: 'arion-histogram',
    templateUrl: './histogram.component.html',
    styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnChanges {
    @Input() data: number[] = [];
    @Input() binCount: number = 20;

    chartData?: ChartConfiguration<'bar'>['data'];
    chartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                title: { display: true, text: 'Avg Performance' },
                ticks: { maxRotation: 0 }
            },
            y: {
                title: { display: true, text: 'Count' },
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    private lastDataKey = '';

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            const key = this.data ? this.data.join(',') : '';
            if (key !== this.lastDataKey) {
                this.lastDataKey = key;
                this.buildHistogram();
            }
        }
    }

    private buildHistogram() {
        if (!this.data || this.data.length === 0) {
            this.chartData = undefined;
            return;
        }

        const min = Math.min(...this.data);
        const max = Math.max(...this.data);

        if (min === max) {
            this.chartData = {
                labels: [min.toFixed(0)],
                datasets: [{
                    data: [this.data.length],
                    backgroundColor: 'oklch(0.65 0.15 250)'
                }]
            };
            return;
        }

        const binWidth = (max - min) / this.binCount;
        const bins = new Array(this.binCount).fill(0);
        const labels: string[] = [];

        for (let i = 0; i < this.binCount; i++) {
            const binStart = min + i * binWidth;
            labels.push(binStart.toFixed(0));
        }

        for (const value of this.data) {
            let binIndex = Math.floor((value - min) / binWidth);
            if (binIndex >= this.binCount) binIndex = this.binCount - 1;
            bins[binIndex]++;
        }

        this.chartData = {
            labels,
            datasets: [{
                data: bins,
                backgroundColor: 'oklch(0.65 0.15 250)'
            }]
        };
    }
}
