import {Component, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {ClearOriginService} from "../clear-origin.service";
import {Company} from "../interfaces/Company";


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
export class CompanysComponent implements OnInit {
  displayedColumns: string[] = ['name', 'walletAddress'];
  dataSource: Company[] = [];


  constructor(private clearOriginService: ClearOriginService) {
  }

  ngOnInit(): void {
    this.clearOriginService.getCompanies().then(x => {
      this.dataSource = x;
    })
  }
}
