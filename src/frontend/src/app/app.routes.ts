import {Routes} from '@angular/router';
import {CreateDeliveryComponent} from "./create-delivery/create-delivery.component";
import {ShowItemsComponent} from "./show-items/show-items.component";
import {CompanysComponent} from "./companys/companys.component";
import {AddCompanyComponent} from "./add-company/add-company.component";

export const routes: Routes = [
  {path: 'create-delivery', component: CreateDeliveryComponent},
  {path: 'show-items', component: ShowItemsComponent},
  {path: 'admin/companies', component: CompanysComponent},
  {path: 'admin/companies/add', component: AddCompanyComponent}
];


