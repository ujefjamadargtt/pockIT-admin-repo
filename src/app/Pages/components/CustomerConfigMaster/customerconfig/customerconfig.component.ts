import { Component, Input } from '@angular/core';
import { custconfig } from 'src/app/Pages/Models/custconfig';

@Component({
  selector: 'app-customerconfig',
  templateUrl: './customerconfig.component.html',
  styleUrls: ['./customerconfig.component.css']
})
export class CustomerconfigComponent {
  @Input()data:custconfig
  @Input() drawerClose: any;
  @Input()drawerVisible:boolean
  isSpinning:boolean=false
  Close(){
  this.drawerClose
  }
}
