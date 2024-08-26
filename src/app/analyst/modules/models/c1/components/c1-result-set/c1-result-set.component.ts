import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  C1ConfiguratorInitType,
  C1ResultSet,
} from 'aethon-arion-c1';
import { ResultDTO } from 'aethon-arion-pipeline';

@Component({
  selector: 'arion-c1-result-set',
  templateUrl: './c1-result-set.component.html',
  styleUrls: ['./c1-result-set.component.scss'],
})
export class C1ResultSetComponent implements OnInit {
  @Input() resultSet: C1ResultSet | undefined;
  results: ResultDTO[] | undefined;

  ngOnInit(): void {
    if (this.resultSet) {
      this.results = this.resultSet.getResults();
    }
  }
}
