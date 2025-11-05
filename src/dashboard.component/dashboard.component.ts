import { Component, OnInit } from '@angular/core';
// import { CommonFunctionService } from '../Service/CommonFunctionService';
// import { ApiServiceService } from '../Service/api-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public commonFunction = new CommonFunctionService();

  userName = sessionStorage.getItem('userName');
  decreptedUserName = this.userName
    ? this.commonFunction.decryptdata(this.userName)
    : '';
  emailId = sessionStorage.getItem('emailId');
  decryptedEmail = this.emailId
    ? this.commonFunction.decryptdata(this.emailId)
    : '';
  roleId = sessionStorage.getItem('roleId');
  roleIDMain = this.roleId ? this.commonFunction.decryptdata(this.roleId) : '';
  rolename = sessionStorage.getItem('roleName');
  rolemainname = this.rolename
    ? this.commonFunction.decryptdata(this.rolename)
    : '';
  grafanaUrl: SafeResourceUrl;

  constructor(
    private api: ApiServiceService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    const unsafeUrl =
      'http://localhost:3000/dashboard/snapshot/4yrnlZwN1mtAinuLDHAmcQ5oOu4TrpeR?theme=light&fullscreen=true&kiosk=1';
    this.grafanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);

    if (
      this.rolemainname == null ||
      this.rolemainname == undefined ||
      this.rolemainname == ''
    ) {
      this.api
        .getAllRoles(0, 0, '', '', ' AND ID=' + this.roleIDMain)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'][0] != null && data['data'][0] != undefined) {
                sessionStorage.setItem(
                  'roleName',
                  this.commonFunction.encryptdata(
                    data['data'][0]['NAME'].toString()
                  )
                );
                this.rolemainname = data['data'][0]['NAME'];
              }
            }
          },
          (err) => { }
        );
    }
  }
}
