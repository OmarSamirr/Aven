import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { FlowbiteService } from './Core/Services/flowbite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private _FlowbiteService: FlowbiteService) {}
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite((flowbite) => {});
  }
}
