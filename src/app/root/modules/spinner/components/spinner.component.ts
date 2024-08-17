import { Component } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'arion-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  spinnerText$: Observable<string>
  constructor(private spinnerService: SpinnerService) {
    this.spinnerText$ = this.spinnerService.getText$();
  }
}
