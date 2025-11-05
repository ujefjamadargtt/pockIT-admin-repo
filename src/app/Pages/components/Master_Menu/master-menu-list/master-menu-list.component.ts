import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-master-menu-list',
  templateUrl: './master-menu-list.component.html',
  styleUrls: ['./master-menu-list.component.css'],
})
export class MasterMenuListComponent implements OnInit {
  loadingRecords = true;
  forms: any[] = [];
  public commonFunction = new CommonFunctionService();
  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  titleWiseChildren: Record<string, any[]> = {};
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService, private cookie: CookieService,
  ) { }

  ngOnInit() {
    if (this.decreptedroleId) {
      this.loadForms();
    }
  }

  @Output() menuClick = new EventEmitter<void>();
  onMenuClick(): void {
    this.menuClick.emit();
  }
  onEnterKeyPress(): void {
    // Check if the search query has at least three characters
    if (this.searchQuery.trim().length >= 3) {
      this.filterForms();
    } else {
      // Reset to original forms if less than three characters
      this.titleWiseChildren = this.forms.reduce((acc, item) => {
        const sortedChildren =
          item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
        acc[item.title] = sortedChildren;
        return acc;
      }, {});
    }
  }

  showclass = false;
  onSearchQueryChange(event): void {
    this.searchQuery = event;
    if (
      this.searchQuery.trim().length == undefined ||
      this.searchQuery.trim().length <= 3
    ) {
      this.showclass = false;
    } else {
      this.showclass = true;
    }
    // If the search query is empty, reload the entire list
    // if (this.searchQuery.trim().length === 0) {
    //   this.titleWiseChildren = this.forms.reduce((acc, item) => {
    //     const sortedChildren =
    //       item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
    //     acc[item.title] = sortedChildren;
    //     return acc;
    //   }, {});
    // }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  finalizeLogout() {
    this.cookie.deleteAll();
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  }
  loadForms() {
    this.loadingRecords = true;
    this.api.getForms(this.decreptedroleId).subscribe(
      (data) => {
        if (data['code'] == 200 && data['data']) {
          this.loadingRecords = false;
          this.forms = data['data'].sort((a, b) => a.SEQ_NO - b.SEQ_NO);

          // Create an object that maps each title to its corresponding children
          this.titleWiseChildren = this.forms.reduce((acc, item) => {
            // Sort children by SEQ_NO
            const sortedChildren =
              item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
            acc[item.title] = sortedChildren; // Associate title with its sorted children
            return acc;
          }, {});
        } else if (data['code'] == 403) {
          this.finalizeLogout();
        } else {
          this.forms = [];
          // this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Network error: Please check your internet connection.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  searchQuery = '';

  filterForms(): void {
    // If the search query is less than three characters, reset to original forms
    if (this.searchQuery.trim().length < 3) {
      this.titleWiseChildren = this.forms.reduce((acc, item) => {
        const sortedChildren =
          item.children?.sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];
        acc[item.title] = sortedChildren;
        return acc;
      }, {});
      this.showclass = false;
      return;
    }

    // Perform the filtering if the search query has at least three characters
    this.titleWiseChildren = this.forms.reduce((acc, item) => {
      const filteredChildren =
        item.children
          ?.filter((child: any) =>
            child.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
          .sort((a, b) => a.SEQ_NO - b.SEQ_NO) || [];

      if (filteredChildren.length > 0) {
        acc[item.title] = filteredChildren;
      }
      this.showclass = false;
      return acc;
    }, {});
  }
}
