import {Component} from '@angular/core';
import {ClearOriginService} from "../clear-origin.service";
import {Delivery} from "../interfaces/Delivery";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [
    MatExpansionModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss'
})
export class DeliveriesComponent {

  public deliveries: Delivery[] = [];


  public constructor(private clearOriginService: ClearOriginService) {
    this.clearOriginService.getDeliverys(this.clearOriginService.accounts[0]).then(x => {
      this.deliveries = x;
    })
  }
}
