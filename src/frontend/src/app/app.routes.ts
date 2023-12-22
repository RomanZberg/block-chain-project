import {Routes} from '@angular/router';
import {CreateDeliveryComponent} from "./create-delivery/create-delivery.component";
import {ShowItemsComponent} from "./show-items/show-items.component";
import {CompanysComponent} from "./companys/companys.component";
import {AddCompanyComponent} from "./add-company/add-company.component";
import {DeliveriesComponent} from "./deliveries/deliveries.component";
import {DeliverieTrackerComponent} from "./deliverie-tracker/deliverie-tracker.component";
import {DeliverieTrackerDetailComponent} from "./deliverie-tracker-detail/deliverie-tracker-detail.component";

export const routes: Routes = [
  {path: 'delivery-tracker', component: DeliverieTrackerComponent},
  {path: 'delivery-tracker/:id', component: DeliverieTrackerDetailComponent},
  {path: 'create-delivery', component: CreateDeliveryComponent},
  {path: 'deliveries', component: DeliveriesComponent},
  {path: 'admin/companies', component: CompanysComponent},
  {path: 'admin/companies/add', component: AddCompanyComponent}
];


