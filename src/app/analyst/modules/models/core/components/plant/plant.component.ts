import { Component, Input } from '@angular/core';
import { OrgConfigDTO } from 'aethon-arion-pipeline';

@Component({
  selector: 'arion-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent {
  @Input() orgConfig: OrgConfigDTO = {} as OrgConfigDTO;

}
