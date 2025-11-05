import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import {
  Department,
  DepartmentworkingDetails,
} from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers: [DatePipe],
})
export class DepartmentComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  dataList: any = [];
  sortValue: string = 'desc';
  sortKey: string = 'id';
  @Input() drawerClose: Function;
  @Input() data: Department;
  isSpinning = false;
  @Input() listOfData: DepartmentworkingDetails[] = [];
  OPEN_TIME;
  CLOSE_TIME;
  @Input() OPEN_TIME2;
  @Input() CLOSE_TIME2;
  fKey = '';
  listdata2: any = [];
  listdata1: any = [];
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMddHHmmss');
  fileDataLOGO_URL: File | null = null;
  folderName = 'departmentIcon';
  @Input() DAYS = false;
  isOk = true;
  regexp = /^\S/;
  spatt = /^[a-zA-Z0-9 ]+$/;
  org: any = [];
  orgId = this.cookie.get('orgId');

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private cookie: CookieService
  ) { }

  ngOnInit() {
    this.CreateData();
    // this.getallorg1();

    this.api
      .getAllOrganizations(this.pageIndex, this.pageSize, this.sortKey, '', '')
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.org = data['body']['data'];
        },
        (err) => { }
      );
  }

  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
    this.add();
  }

  add(): void {
    this.api
      .getAllDepartments(
        1,
        1,
        'SEQUENCE_NO',
        'desc',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['count'] == 0) {
            this.data.SEQUENCE_NO = 1;
          } else {
            this.data.SEQUENCE_NO = Number(data['data'][0]['SEQUENCE_NO']) + 1;
            this.data.STATUS = true;
          }
        },
        (err) => { }
      );
  }

  departments() {
    this.api
      .getAllDepartments(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        '',
        ' and STATUS=1'
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
        },
        (err) => { }
      );
  }

  setAllDays(event) {
    this.DAYS = event;
  }

  setOpenTime(event) {
    this.OPEN_TIME2 = event;

    for (let i = 0; i < 7; i++) {
      if (this.listOfData[i]['IS_HOLIDAY'] == false) {
        this.listOfData[i]['OPEN_TIME'] = this.OPEN_TIME2;
        this.listOfData[i]['CLOSE_TIME'] = this.CLOSE_TIME2;
      }

      if (this.listOfData[i]['IS_HOLIDAY'] == true) {
        this.listOfData[i]['OPEN_TIME'] = this.OPEN_TIME;
        this.listOfData[i]['CLOSE_TIME'] = this.CLOSE_TIME;
      }
    }
  }

  setCloseTime(event) {
    this.CLOSE_TIME2 = event;
    for (let i = 0; i < 7; i++) {
      if (this.listOfData[i]['IS_HOLIDAY'] == false) {
        this.listOfData[i]['OPEN_TIME'] = this.OPEN_TIME2;
        this.listOfData[i]['CLOSE_TIME'] = this.CLOSE_TIME2;
      }

      if (this.listOfData[i]['IS_HOLIDAY'] == true) {
        this.listOfData[i]['OPEN_TIME'] = this.OPEN_TIME;
        this.listOfData[i]['CLOSE_TIME'] = this.CLOSE_TIME;
      }
    }
  }

  CreateData() {
    for (let i = 0; i < 7; i++) {
      this.listOfData.push({
        ID: 0,
        DAY: i,
        IS_HOLIDAY: false,
        OPEN_TIME: this.OPEN_TIME,
        CLIENT_ID: this.api.clientId,
        DEPARTMENT_ID: 0,
        DATE: '',
        CLOSE_TIME: this.CLOSE_TIME,
      });
    }
  }

  onFileSelectedLOGO_URL(event) {
    this.fileDataLOGO_URL = <File>event.target.files[0];

    var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
  }
  // getallorg1() {
  //   this.api.getAllDepartments(0, 0, '', 'asc', ' AND STATUS =1').subscribe(
  //     (data) => {
  //       if (data['status'] == '200') {
  //         this.listdata1 = data['body']['data'];
  //         this.isSpinning = false;
  //       } else {
  //         this.listdata1 = [];
  //         this.message.error('Failed to get Department data...', '');
  //         this.isSpinning = false;
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.isSpinning = false;
  //       if (err.status === 0) {
  //         this.message.error(
  //           'Unable to connect. Please check your internet or server connection and try again shortly.',
  //           ''
  //         );
  //       } else {
  //         // this.message.error("Something went wrong.", "");
  //       }
  //     }
  //   );
  // }
  // getallorg1() {
  //   this.api.getAllDepartments(0, 0, "ID", "desc", "").subscribe(
  //     (data) => {
  //       if (data["code"] == 200) {
  //         this.listdata1 = data["data"];
  //       }
  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }
  isFocused: string = '';
  getallorg2(deptID: number) {
    this.api
      .getAllDepartments(0, 0, 'ID', 'desc', ' AND ID !=' + deptID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.listdata2 = data['data'];
          }
        },
        (err) => { }
      );
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    this.isSpinning = true;
    this.data.ORG_ID = 1;
    //
    if (
      (this.data.NAME.trim() == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.SHORT_CODE == undefined ||
        this.data.SHORT_CODE == null ||
        this.data.SHORT_CODE == 0) &&
      (this.data.SEQUENCE_NO == null ||
        this.data.SEQUENCE_NO == undefined ||
        this.data.SEQUENCE_NO == 0) &&
      (this.data.TICKET_TIME_PERIOD == null ||
        this.data.TICKET_TIME_PERIOD == undefined ||
        this.data.TICKET_TIME_PERIOD == 0)
    ) {
      this.message.error('Please Fill All The Required Fields ', '');
      this.isOk = false;
      this.isSpinning = false;
    } else if (!this.data.NAME || this.data.NAME.trim() == '') {
      this.message.error('Please enter name', '');
      this.isOk = false;
      this.isSpinning = false;
    } else if (this.data.NAME || this.data.NAME.trim() != '') {
      //
      if (this.api.checkTextBoxIsValid1(this.data.NAME) == false) {
        this.message.error('Please Enter valid Department Name', '');
        this.isOk = false;
        this.isSpinning = false;
      } else {
        // this.isOk = true;
        // this.isSpinning = true;
        if (!this.data.SHORT_CODE && this.data.SHORT_CODE.trim() == '') {
          this.message.error('Please Enter Shortcode', '');
          this.isOk = false;
          this.isSpinning = false;
        } else if (this.data.SHORT_CODE || this.data.SHORT_CODE.trim() != '') {
          if (!this.api.checkTextBoxIsValid(this.data.SHORT_CODE)) {
            this.message.error('Please Enter valid Shortcode', '');
            this.isOk = false;
            this.isSpinning = false;
          } else {
            // this.isOk = true;
            // this.isSpinning = true;
            if (this.data.TICKET_TIME_PERIOD == null) {
              this.message.error(
                'Please Enter Valid Ticket Closure Time (In Day(s))',
                ''
              );
              this.isOk = false;
              this.isSpinning = false;
            } else if (this.isOk) {
              this.isSpinning = true;
              this.orgId = this.cookie.get('orgId');

              if (this.data.ID) {
                // var emailData2 = this.listdata1.filter((obj) => {
                //   return (
                //     obj.SHORT_CODE == this.data.SHORT_CODE &&
                //     obj.ID != this.data.ID
                //   );
                // });

                // if (emailData2.length == 0) {
                this.isSpinning = true;

                this.api.updateDepartment(this.data).subscribe(
                  (successCode: any) => {
                    if (
                      successCode['status'] == 200 &&
                      successCode.body['code'] === 200
                    ) {
                      this.message.success(
                        'Department Updated Successfully',
                        ''
                      );
                      if (!addNew) this.drawerClose();
                      this.isSpinning = false;
                    } else if (
                      successCode.body['code'] === 300 &&
                      successCode['status'] === 200
                    ) {
                      this.message.error(successCode.message, '');
                      this.isSpinning = false;
                    } else {
                      this.message.error('Department Updation Failed', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {
                    this.message.error(
                      'Something went wrong, please try again later',
                      ''
                    );
                    this.isSpinning = false;
                  }
                );
                // }
              } else {
                // var emailData: any = this.listdata1.filter((obj) => {
                //   return (
                //     obj.SHORT_CODE == this.data.SHORT_CODE &&
                //     obj.ID != this.data.ID
                //   );
                // });
                //

                // if (emailData.length == 0) {
                this.isSpinning = true;
                this.api.createDepartment(this.data).subscribe(
                  (successCode: any) => {
                    if (
                      successCode['status'] === 200 &&
                      successCode.body['code'] === 200
                    ) {
                      this.message.success(
                        'Department Created Successfully',
                        ''
                      );
                      if (!addNew) {
                        this.drawerClose();
                        this.isSpinning = false;
                      } else {
                        this.data = new Department();
                        this.resetDrawer(accountMasterPage);
                        this.api
                          .getAllDepartments(0, 0, '', 'desc', '')
                          .subscribe(
                            (data) => {
                              if (data['body']['count'] == 0) {
                                this.data.SEQUENCE_NO = 1;
                              } else {
                                this.data.SEQUENCE_NO =
                                  data['body']['data'][0]['SEQUENCE_NO'] + 1;
                              }
                            },

                            (err) => {
                              this.message.error(
                                'Something went wrong, please try again later',
                                ''
                              );
                              this.isSpinning = false;
                            }
                          );
                      }
                      this.isSpinning = false;
                    } else if (
                      successCode.body['code'] === 300 &&
                      successCode['status'] === 200
                    ) {
                      this.message.error(successCode.message, '');
                      this.isSpinning = false;
                    } else {
                      this.message.error('Department Creation Failed...', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {
                    this.message.error(
                      'Something went wrong, please try again later',
                      ''
                    );
                    this.isSpinning = false;
                  }
                );
                // } else {
                //   console.log('12345678');
                //   // this.message.error(
                //   //   'Shortcode Exist Please Enter Other Shortcode',
                //   //   ''
                //   // );
                //   // this.isSpinning = false;
                // }
              }
            }
          }
        }
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
}