import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../environment/environment";
import {ClearOriginService} from "./clear-origin.service";
import {RouterModule} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule, NgIf} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";


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
    NgIf,
    ClipboardModule,
    MatInputModule
  ],
  providers: [ClearOriginService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ClearOrigin';

  public loggedIn: boolean = false;
  public isCompany: boolean = false;
  public isAdmin: boolean = false;


  public constructor(private httpClient: HttpClient,
                     private clearOriginService: ClearOriginService,
                     private clipboard: Clipboard,
                     private _snackBar: MatSnackBar
  ) {
    console.log(
      'our contract address: ', environment.contractAddress
    )

    this.clearOriginService.accountStatusSource.subscribe(x => {
      if (x.length > 0) {
        this.loggedIn = true;

        this.clearOriginService.getCompany(x[0]).then(c => {
          this.isCompany = true;
        });

        const admins = this.clearOriginService.getAdmins().then(a => {
          if (a.includes(x[0])) {
            this.isAdmin = true;
          }
          console.log('admins', a);
        });


      }
      console.log('new accounts', x)
    })
  }

  public get contractAddress() {
    return environment.contractAddress
  }

  ngOnInit(): void {

  }

  public getAdmins() {

  }


  public copyContractAddressToClipBoard() {
    this.clipboard.copy(environment.contractAddress);
    this._snackBar.open("Successfully copied smart contract address to clipboard",
      '', {
        duration: 1000
      })
  }

  login() {
    this.clearOriginService.connectAccount();
  }
}




