import {Component, OnInit} from '@angular/core';
import {ClearOriginService} from "../clear-origin.service";
import {MatCardModule} from "@angular/material/card";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-delivery',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-delivery.component.html',
  styleUrl: './create-delivery.component.scss'
})
export class CreateDeliveryComponent {

  get items(): FormArray {
    return this.deliveryForm.get('items') as FormArray;
  }


  public deliveryForm: FormGroup = this.formBuilder.group({
    items: this.formBuilder.array([
      this.formBuilder.group({
        itemName: ['', Validators.required],
        numberOfItems: ['', Validators.required]
      })
    ])
  });

  constructor(
    private formBuilder: FormBuilder,
    private clearOriginService: ClearOriginService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
  }


  addItem() {
    const itemNameFormControl = new FormControl('');
    const numberOfElementsFormControl = new FormControl('');

    itemNameFormControl.addValidators(Validators.required);
    numberOfElementsFormControl.addValidators(Validators.required);

    this.items.push(
      new FormGroup({
        itemName: itemNameFormControl,
        numberOfItems: numberOfElementsFormControl
      })
    );
  }


  onSubmit() {
    console.log('submit')
    if (this.deliveryForm.valid) {
      console.log(this.deliveryForm.value)

      this.clearOriginService.createDelivery(this.deliveryForm.value.items).then(x => {
        this._snackBar.open("Delivery successfully created", "Ok");
        this.router.navigateByUrl('/deliveries')
        console.log(x);
      })
    }
  }
}
