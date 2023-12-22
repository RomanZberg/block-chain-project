import {Component} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ClearOriginService} from "../clear-origin.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-deliverie-tracker',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './deliverie-tracker.component.html',
  styleUrl: './deliverie-tracker.component.scss'
})
export class DeliverieTrackerComponent {


  public deliveryForm: FormGroup = this.formBuilder.group({
    deliveryId: ['', Validators.required],
  });


  constructor(
    private formBuilder: FormBuilder,
    private clearOriginService: ClearOriginService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    console.log(formBuilder)
  }

  onSubmit() {
    if (this.deliveryForm.valid) {
      this.router.navigateByUrl(`/delivery-tracker/${this.deliveryForm.value.deliveryId}`)
    }
  }
}
