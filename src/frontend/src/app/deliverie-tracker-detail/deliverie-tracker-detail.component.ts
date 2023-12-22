import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ClearOriginService} from "../clear-origin.service";
import {ResponseError} from "web3";
import {Company} from "../interfaces/Company";
import {NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Delivery} from "../interfaces/Delivery";

interface HistoryEntry {
  companyName: string;
  walletAddress: string;
}

@Component({
  selector: 'app-deliverie-tracker-detail',
  standalone: true,
  imports: [
    NgForOf,
    MatIconModule,
    NgIf
  ],
  templateUrl: './deliverie-tracker-detail.component.html',
  styleUrl: './deliverie-tracker-detail.component.scss'
})
export class DeliverieTrackerDetailComponent implements OnInit {

  public deliveryId: any;

  public history: HistoryEntry[] = [];

  public delivery: Delivery | null = null;

  constructor(
    private router: Router,
    private aciveroute: ActivatedRoute,
    private clearOriginService: ClearOriginService
  ) {
  }

  ngOnInit(): void {
    this.aciveroute.params.subscribe(x => {
      this.deliveryId = x['id'];
      this.generateHistory();

      this.clearOriginService.getDelivery(parseInt(x['id'])).then(d => {
        this.delivery = d;
        console.log(this.delivery);
      })
    });
  }

  private async generateHistory() {
    const history: any[] = await this.clearOriginService.getHistoryOfNFT(this.deliveryId)
    const companyMap: any[string] = []

    companyMap["0x0000000000000000000000000000000000000000"] = {
      name: "ClearOrigin",
      walletAddress: "0x0000000000000000000000000000000000000000",
      products: []
    } as Company;

    for (const wa of history) {

      if (typeof companyMap[wa] !== 'undefined') {
        continue
      }

      try {
        companyMap[wa] = await this.clearOriginService.getCompany(wa);
      } catch (e: any) {
        console.log('could not get company for ', wa)
        companyMap[wa] = {
          name: "Unknown",
          walletAddress: wa,
          products: []
        } as Company;
      }
    }

    for (const wa of history) {
      const company: Company = companyMap[wa];
      this.history.push({
        companyName: company.name,
        walletAddress: company.walletAddress
      })
    }
  }
}
