import {Component, OnInit} from '@angular/core';
import {ClearOriginService} from "../clear-origin.service";

@Component({
  selector: 'app-show-items',
  standalone: true,
  imports: [],
  templateUrl: './show-items.component.html',
  styleUrl: './show-items.component.scss'
})
export class ShowItemsComponent implements OnInit{

  constructor(private clearOriginService: ClearOriginService) {
  }

  ngOnInit(): void {
    console.log(this.clearOriginService.testVar)
    console.log(this.clearOriginService)

  }

}
