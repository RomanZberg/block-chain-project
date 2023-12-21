import {Component, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {ClearOriginService} from "../clear-origin.service";

export interface Company {
  name: string;
  walletAddress: string;
}

const ELEMENT_DATA: Company[] = [
  { name: 'Gucci', walletAddress: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' },
];


@Component({
  selector: 'app-companys',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './companys.component.html',
  styleUrl: './companys.component.scss'
})
export class CompanysComponent implements OnInit{
  displayedColumns: string[] = ['name', 'walletAddress'];
  dataSource = ELEMENT_DATA;


  constructor(private clearOriginService: ClearOriginService) {
  }

  ngOnInit(): void {

    this.clearOriginService.getCompanies().then(x=>{
      console.log(x)
    })
  }



}
