import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { ApiServiceService } from '../Service/api-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  is_show = false;
  constructor(
    private api: ApiServiceService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.is_show = false;
    if (
      this.roleIDMain != null &&
      this.roleIDMain != undefined &&
      this.roleIDMain != '0'
    ) {
      this.api
        .getDashboard(
          1,
          1,
          '',
          '',
          ' AND STATUS=1 AND ROLE_ID=' + this.roleIDMain
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              if (
                data['body']['data'][0] != null &&
                data['body']['data'][0] != undefined
              ) {
                this.is_show = true;
                const unsafeUrl =
                  data['body']['data'][0]['SNAPSHOT_LINK'] +
                  '?theme=light&fullscreen=true&kiosk';
                this.grafanaUrl =
                  this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
              }
            }
          },
          (err) => { }
        );
    }
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
