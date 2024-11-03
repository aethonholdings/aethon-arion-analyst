import { Component, Input, OnInit } from '@angular/core';
import { ResultSet } from 'aethon-arion-pipeline';
import { ResultDTO } from 'aethon-arion-pipeline';

@Component({
  selector: 'arion-c1-result-set',
  templateUrl: './c1-result-set.component.html',
  styleUrls: ['./c1-result-set.component.scss'],
})
export class C1ResultSetComponent implements OnInit {
  @Input() resultSet: ResultSet | undefined;
  results: ResultDTO[] | undefined;

  ngOnInit(): void {
    if (this.resultSet) {
      this.results = this.resultSet.getResults();
    }
  }
}
