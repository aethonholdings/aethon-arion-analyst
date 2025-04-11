import { Component, EventEmitter, Input, Output } from '@angular/core';
import { C1ModelName } from 'aethon-arion-c1';
import { ConfiguratorParamData, OptimiserStateDTO } from 'aethon-arion-pipeline';

@Component({
  selector: 'arion-optimiser-state-view',
  templateUrl: './optimiser-state-view.component.html',
  styleUrls: ['./optimiser-state-view.component.scss']
})
export class OptimiserStateViewComponent {
      @Input() optimiserState!: OptimiserStateDTO<ConfiguratorParamData>;
      @Output() optimiserStateChange = new EventEmitter<OptimiserStateDTO<ConfiguratorParamData>>();
      c1ModelName = C1ModelName;
}
