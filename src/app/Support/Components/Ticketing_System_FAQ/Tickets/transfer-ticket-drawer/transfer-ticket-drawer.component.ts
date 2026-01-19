import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-transfer-ticket-drawer',
  templateUrl: './transfer-ticket-drawer.component.html',
  styleUrls: ['./transfer-ticket-drawer.component.css'],
})
export class TransferTicketDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: any;
  @Input() data2: any;
  @Input() EMPLOYEE_ID: any;
  isLoading = false;
  constructor(
    private cookie: CookieService,
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);
  backofficeid = sessionStorage.getItem('backofficeId');
  decreptedbackofficeIDString = this.backofficeid
    ? this.commonFunction.decryptdata(this.backofficeid)
    : '';
  decreptedbackofficeID = parseInt(this.decreptedbackofficeIDString, 10);
  ngOnInit() {
    this.getMappedDepartments();
  }
  @Input() empList: any = [];
  data3: any[] = [];
  departmentmappeddata: any;
  backofficeId: any = [];
  getMappedDepartments() {
    this.departmentmappeddata = [];
    this.api
      .mappedDepartments(
        0,
        0,
        '',
        '',
        ' AND IS_ACTIVE = 1 AND DEPARTMENT_ID =' + this.data2.DEPARTMENT_ID
      )
      .subscribe(
        (data) => {
          this.departmentmappeddata = data['data'];
          for (var i = 0; i < this.departmentmappeddata?.length; i++) {
            this.backofficeId.push(
              this.departmentmappeddata[i]['BACKOFFICE_ID']
            );
          }
          this.getAllEmployee();
        },
        (err) => { }
      );
  }
  getAllEmployee() {
    this.empList = [];
    const filteredBackofficeIds = this.backofficeId.filter(
      (id) => id !== this.decreptedbackofficeID
    );
    if (filteredBackofficeIds) {
      this.api
        .getBackOfficeData(
          0,
          0,
          '',
          '',
          ' AND ROLE_ID = 25 AND ID IN (' + filteredBackofficeIds + ')'
        )
        .subscribe(
          (data) => {
            this.empList = data['data'];
          },
          (err) => { }
        );
    }
  }
  close(myForm: NgForm) {
    this.drawerClose();
    this.resetPage(myForm);
  }
  resetPage(myForm: NgForm) {
    myForm.form.reset();
  }
  save(myForm: NgForm) {
    var isOk = true;
    if (this.EMPLOYEE_ID != undefined) {
      if (this.EMPLOYEE_ID == null || this.EMPLOYEE_ID == 0) {
        isOk = false;
        this.message.error('Please Select Valid Employee Name', '');
      }
    } else {
      isOk = false;
      this.message.error('Please Select Valid Employee Name', '');
    }
    if (isOk) {
      this.data2.TAKEN_BY_USER_ID = this.EMPLOYEE_ID;
      this.data2['TAKEN_FROM_USER_ID'] = this.decrepteduserID;
      this.data2.TRANSFER_USER_ID = this.EMPLOYEE_ID;
      this.isLoading = true;
      this.api.transferTicket(this.data2).subscribe(
        (successCode) => {
          if (successCode['status'] == '200') {
            this.isLoading = false;
            this.close(myForm);
            this.message.success('Ticket Transferred successfully...', '');
          } else {
            this.isLoading = false;
            this.message.error('Failed to Transfer Ticket...', '');
          }
        },
        (err) => {
          this.isLoading = false;
          if (err['ok'] == false) {
            this.message.error('Server Not Found', '');
          }
        }
      );
    }
  }
}