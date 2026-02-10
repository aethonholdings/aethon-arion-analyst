import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { C1ModelName } from 'aethon-arion-c1';
import { ConfiguratorParamData, OptimiserStateDTO } from 'aethon-arion-pipeline';

@Component({
  selector: 'arion-optimiser-state-view',
  templateUrl: './optimiser-state-view.component.html',
  styleUrls: ['./optimiser-state-view.component.scss']
})
export class OptimiserStateViewComponent implements OnInit {
      @Input() optimiserState!: OptimiserStateDTO<ConfiguratorParamData>;
      @Output() optimiserStateChange = new EventEmitter<OptimiserStateDTO<ConfiguratorParamData>>();
      c1ModelName = C1ModelName;
      orgConfigId?: number;

      ngOnInit() {
          // Extract orgConfigId from the baseline datapoint (x)
          const baselineDatapoint = (this.optimiserState as any).optimiserData?.dataPoints?.find(
              (dp: any) => dp.id === 'x'
          );
          if (baselineDatapoint?.data?.inputs?.orgConfigId) {
              this.orgConfigId = baselineDatapoint.data.inputs.orgConfigId;
          }
      }
}
