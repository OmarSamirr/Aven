import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../Core/Services/flowbite.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.scss',
})
export class NavAuthComponent implements OnInit {
  constructor(private _FlowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite((flowbite) => {});
  }

}
