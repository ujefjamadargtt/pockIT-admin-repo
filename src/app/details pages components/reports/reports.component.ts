import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportComponent implements OnInit {
  loadingRecords = true;
  forms: any[] = [];
  formsSeq11: any[] = [];
  formsSeq12: any[] = [];
  formsSeq13: any[] = [];
  formsSeq14: any[] = [];
  public commonFunction = new CommonFunctionService();

  constructor(public router: Router, public api: ApiServiceService, public message: NzNotificationService) { }
  @Output() menuClick = new EventEmitter<void>();
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId ? this.commonFunction.decryptdata(this.roleId) : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  titleWiseChildren: Record<string, any[]> = {};
  titleWiseChildren1: Record<string, any[]> = {};
  titleWiseChildren2: Record<string, any[]> = {};
  titleWiseChildren3: Record<string, any[]> = {};
  titleWiseChildren4: Record<string, any[]> = {};

  // constructor(private router: Router) { }

  onMenuClick(): void {
    this.menuClick.emit();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  ngOnInit() {
    this.api.getForms(this.decreptedroleId).subscribe(
      (data) => {
        if (data['code'] == 200 && data['data']) {
          this.loadingRecords = false;

          // Filter for SEQ_NO 10
          const filteredForms = data['data'].filter(form => form.SEQ_NO === 10);
          this.forms = filteredForms.sort((a, b) => a.SEQ_NO - b.SEQ_NO);

          // Filter for SEQ_NO 11, 12, 13, 14 separately
          this.formsSeq11 = data['data'].filter(form => form.SEQ_NO === 11);
          this.formsSeq12 = data['data'].filter(form => form.SEQ_NO === 12);
          this.formsSeq13 = data['data'].filter(form => form.SEQ_NO === 13);
          this.formsSeq14 = data['data'].filter(form => form.SEQ_NO === 14);

          // Create an object that maps each title to its corresponding children
          this.titleWiseChildren = this.forms.reduce((acc, item) => {
            const sortedChildren = item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});
          this.titleWiseChildren1 = this.formsSeq11.reduce((acc, item) => {
            const sortedChildren = item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});
          this.titleWiseChildren2 = this.formsSeq12.reduce((acc, item) => {
            const sortedChildren = item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});
          this.titleWiseChildren3 = this.formsSeq13.reduce((acc, item) => {
            const sortedChildren = item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});
          this.titleWiseChildren4 = this.formsSeq14.reduce((acc, item) => {
            const sortedChildren = item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren;
            return acc;
          }, {});
        } else {
          this.forms = [];
          this.loadingRecords = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error("Network error: Please check your internet connection.", "");
        } else {
          this.message.error("Something Went Wrong.", "");
        }
      }
    );

  }


  back() {
    this.router.navigate(['/masters/menu']);
  }


  // reports = [
  //   { title: 'Order Summary', route: '/masters/order-summary-report' },
  //   { title: 'Order Details', route: '/masters/order-detailed-report' },
  //   { title: 'Order Cancellation Details', route: '/masters/order-cancellation-report' },
  //   { title: 'B2B Customer Summary', route: '/masters/b2b-customer-service-summary-report' },
  //   { title: 'Assigned Jobs', route: '/masters/job-assignment-report' },
  //   { title: 'Technician Wise Job Card details', route: '/masters/technician-wise-job-card-report' },
  //   { title: 'Technician Performance Details', route: '/masters/technician-performance-report' },
  //   { title: 'Refund Details', route: '/masters/refund-report' }
  // ];


  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
