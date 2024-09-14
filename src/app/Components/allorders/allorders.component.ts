import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../Core/Services/authentication.service';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../Core/Services/orders.service';
import { IOrders } from '../../Core/Interfaces/iorders';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit, OnDestroy{

  private readonly _OrdersService = inject(OrdersService);
  private readonly _AuthenticationService = inject(AuthenticationService);

  getAllOrdersSubscription!: Subscription;
  ordersList:IOrders[]=[]; 


  ngOnInit(): void {
    this._AuthenticationService.saveUserData();
    this.getAllOrdersSubscription = this._OrdersService.getAllUserOrders(this._AuthenticationService.userData.id).subscribe({
      next:(res)=>{
        this.ordersList = res;
      }
    })
  }


  ngOnDestroy(): void {
    this.getAllOrdersSubscription?.unsubscribe();
  }
}
