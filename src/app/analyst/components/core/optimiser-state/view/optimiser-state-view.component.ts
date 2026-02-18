import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { C1ModelName } from 'aethon-arion-c1';
import { ConfiguratorParamData, OptimiserStateDTO, StateType } from 'aethon-arion-pipeline';
import { OrgConfigTableRow, SimConfigClickEvent } from '../../org-config/views/table/org-config-table.component';

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
      orgConfigRows: OrgConfigTableRow[] = [];

      constructor(private router: Router) {}

      ngOnInit() {
          const convergenceTests = (this.optimiserState as any).convergenceTests;
          if (!convergenceTests?.length) return;

          // Extract orgConfigId from first simConfig (for the "View Baseline OrgConfig" button)
          const firstSimConfig = convergenceTests[0]?.simConfigs?.[0];
          if (firstSimConfig?.orgConfig?.id) {
              this.orgConfigId = firstSimConfig.orgConfig.id;
          } else if (firstSimConfig?.orgConfigId) {
              this.orgConfigId = firstSimConfig.orgConfigId;
          }

          // Build org config rows grouped by orgConfigId
          const orgConfigMap = new Map<number, OrgConfigTableRow>();
          for (const ct of convergenceTests) {
              const ctHash = ct.configuratorParams?.hash || '';
              if (!ct.simConfigs) continue;
              for (const sc of ct.simConfigs) {
                  const ocId = sc.orgConfig?.id || sc.orgConfigId;
                  if (!ocId) continue;

                  if (!orgConfigMap.has(ocId)) {
                      orgConfigMap.set(ocId, {
                          orgConfigId: ocId,
                          configHash: ctHash.substring(0, 8),
                          state: 'pending',
                          simConfigs: []
                      });
                  }
                  orgConfigMap.get(ocId)!.simConfigs.push({
                      id: sc.id,
                      avgPerformance: sc.avgPerformance ?? null,
                      state: sc.state || 'pending'
                  });
              }
          }

          // Derive aggregate state
          const statePriority: StateType[] = ['failed', 'running', 'pending', 'completed'];
          for (const row of orgConfigMap.values()) {
              const states = row.simConfigs.map(sc => sc.state);
              row.state = statePriority.find(s => states.includes(s)) || 'pending';
          }

          this.orgConfigRows = Array.from(orgConfigMap.values());
      }

      navigateToOrgConfig(orgConfigId: number) {
          this.router.navigate(['/org-config', orgConfigId], {
              queryParams: {
                  optimiserStateId: this.optimiserState.id,
                  simSetId: (this.optimiserState as any).simSet?.id
              }
          });
      }

      navigateToSimConfig(event: SimConfigClickEvent) {
          this.router.navigate(['/sim-config', event.simConfigId], {
              queryParams: {
                  simSetId: (this.optimiserState as any).simSet?.id,
                  optimiserStateId: this.optimiserState.id,
                  orgConfigId: event.orgConfigId
              }
          });
      }
}
