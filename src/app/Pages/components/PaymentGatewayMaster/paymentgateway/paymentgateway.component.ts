import { Component, Input } from '@angular/core';
import { paymentgateway } from 'src/app/Pages/Models/paymentgateway';

@Component({
  selector: 'app-paymentgateway',
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.css']
})
export class PaymentgatewayComponent {
  @Input()data:paymentgateway
  @Input() drawerClose: any;
  @Input()drawerVisible:boolean
  isSpinning:boolean=false
  Close(){
  this.drawerClose
  }
}
