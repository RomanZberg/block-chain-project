import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../environment/environment";
import {ClearOriginService} from "./clear-origin.service";
import { RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule, NgIf} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NgIf
  ],
  providers: [ClearOriginService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';


  public constructor(private httpClient: HttpClient,
                     private clearOriginService: ClearOriginService
  ) {
    console.log(
      'our contract address: ', environment.contractAddress
    )
  }

  ngOnInit(): void {
    this.httpClient.get('/assets/abis/_app_contracts_ClearOriginNetwork_sol_ClearOriginNetwork.abi').subscribe(x => {
      console.log(x);
    })





  }


  public callCreateCompany() {
  }


  public getAdmins() {
    this.clearOriginService.getAdmins().then(x => {
      console.log(x)
    })
  }


  setServiceValue() {
    this.clearOriginService.setTestVar();
  }
}




