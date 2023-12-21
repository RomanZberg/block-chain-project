import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {ClearOriginService} from "../clear-origin.service";

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {

  get companyName() {
    return this.companyForm.controls['companyName'];
  }

  get walletAddress() {
    return this.companyForm.controls['walletAddress'];
  }


  public companyForm: FormGroup = this.formBuilder.group({
    companyName: ['', Validators.required],
    walletAddress: ['', Validators.required],
  });


  constructor(private formBuilder: FormBuilder, private clearOriginService: ClearOriginService) {

    console.log(formBuilder)

  }


  onSubmit() {
    if (this.companyForm.valid) {
      console.log(this.companyForm.value)
      this.clearOriginService.createOrganization(this.companyForm.value.companyName, this.companyForm.value.walletAddress, 'tot')
    }
  }



}
