import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainorderComponent } from './mainorder/mainorder.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { ListTechnicainMapComponent } from '../TechnicainMap/list-technicain-map/list-technicain-map.component';
import { ShpoorderlistComponent } from '../Inventorypages/pages/Shop/shpoorderlist/shpoorderlist.component';
import { ReschedulejobrequestComponent } from '../job/reschedulejobrequest/reschedulejobrequest.component';
// import { MastersComponent } from './masters.component';
import { OrdercancelComponent } from './ordercancel/ordercancel.component';
import { OrderCancellationChargesComponent } from './order-cancellation-charges/order-cancellation-charges.component';


const routes: Routes = [
  {
    path: '',
    component: MainorderComponent,
    children: [
      { path: 'order-list', component: OrderlistComponent },
      { path: 'dispatcher', component: ListTechnicainMapComponent },

      { path: 'shop-orders', component: ShpoorderlistComponent },
      {
        path: 'job-reschedule-requests',
        component: ReschedulejobrequestComponent,
      },
      { path: 'ordercancel', component: OrdercancelComponent, },
      { path: 'order-cancellation-charges', component: OrderCancellationChargesComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class orderRoutingModule { }
