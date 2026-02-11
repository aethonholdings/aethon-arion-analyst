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
      activeTab: string = 'gradient-table';

      ngOnInit() {
          // Extract orgConfigId from convergenceTests -> simConfigs -> orgConfig
          const convergenceTests = (this.optimiserState as any).convergenceTests;

          if (convergenceTests?.length > 0) {
              const firstConvergenceTest = convergenceTests[0];
              const simConfigs = firstConvergenceTest.simConfigs;

              if (simConfigs?.length > 0) {
                  const firstSimConfig = simConfigs[0];

                  // Try to get orgConfigId from the orgConfig relation
                  if (firstSimConfig.orgConfig?.id) {
                      this.orgConfigId = firstSimConfig.orgConfig.id;
                  } else if (firstSimConfig.orgConfigId) {
                      // Fallback to orgConfigId property
                      this.orgConfigId = firstSimConfig.orgConfigId;
                  }
              }
          }
      }
}
