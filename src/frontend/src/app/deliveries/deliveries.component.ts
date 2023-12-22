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
    this.clearOriginService.getDeliverys("0xdD2FD4581271e230360230F9337D5c0430Bf44C0").then(x => {
      this.deliveries = x;
    })
  }
}
