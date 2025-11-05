import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Service/api-service.service';
import { ActivatedRoute } from '@angular/router';
import { retry, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-job-completionpopup',
  templateUrl: './job-completionpopup.component.html',
  styleUrls: ['./job-completionpopup.component.css'],
})
export class JobCompletionpopupComponent implements OnInit {
  uniquid: any;
  pageName: any;

  constructor(
    public api: ApiServiceService,
    private activeRoute: ActivatedRoute, public message: NzNotificationService
  ) {
    const url: any = window.location.href;
    const arr: any = url.split('/');
    this.pageName = arr[4];
    this.activeRoute.queryParamMap.subscribe(params => {
      this.uniquid = params.get('key');
      // You can now use this.uniqueId as needed
    });
    // if (this.pageName) {
    //   this.callApiWithRetry(this.pageName);
    // }
  }
  ngOnInit(): void { }
  isSpinning: boolean = false;
  markcopleted() {
    this.isSpinning = true;
    this.api.jobcompletion(this.uniquid).subscribe((successCode: any) => {
      if (successCode.code == "200") {
        this.isSpinning = false;
        this.message.success("Job marked as completed successfully", "");
        // setTimeout(() => {
        window.close();
        // }, 2000);
      } else if (successCode.code == 300) {
        this.isSpinning = false;
        this.message.error("Job already marked as completed", "");
        // setTimeout(() => {
        window.close();
        // }, 2000);
      } else {
        this.message.error("Failed to mark job as completed", "");
        this.isSpinning = false;
      }
    }, err => {
      this.message.error("Something went wrong, please try again later", "");
      this.isSpinning = false;
    });
  }
}
