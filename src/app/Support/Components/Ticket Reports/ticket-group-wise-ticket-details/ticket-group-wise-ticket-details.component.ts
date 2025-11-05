import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { ExportService } from 'src/app/Service/export.service';
// import { ChattdetailsicketComponent } from '../chattdetailsicket/chattdetailsicket.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Ticket } from 'src/app/Support/Models/TicketingSystem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-group-wise-ticket-details',
  templateUrl: './ticket-group-wise-ticket-details.component.html',
  styleUrls: ['./ticket-group-wise-ticket-details.component.css'],
})
export class TicketGroupWiseTicketDetailsComponent implements OnInit {
  formTitle = 'Ticket Group Wise Details';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  dataListForExport = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['TICKET_GROUP_VALUE', 'Ticket Group Name'],
    ['TICKET_NO', 'Ticket No.'],
    ['DATE', 'Created On'],
    ['CREATOR_EMPLOYEE_NAME', 'Created By'],
    ['QUESTION', 'Question'],
    ['IS_TAKEN_STATUS', 'Is Taken'],
    ['TICKET_TAKEN_EMPLOYEE', 'Taken By/ Transfer To'],
    ['LAST_RESPONDED', 'Last Responded Date'],
    ['PRIORITY', 'Priority'],
    ['STATUS', 'Status'],
  ];
  SUPPORT_USERS = [];
  supportUsers = [];
  SUPPORT_AGENTS = [];
  supportAgents = [];
  STATUS = [];
  CREATION_DATE: Date[] = [];
  isSpinning = false;
  filterClass: string = 'filter-visible';
  applicationId = Number(this.cookie.get('applicationId'));
  departmentId = Number(this.cookie.get('departmentId'));
  dateFormat = 'dd/MM/yyyy';
  data1: any = [];
  index = 0;
  ticketQuestion = {};
  ticketGroups = [];
  TICKET_GROUP = [];
  fileName = 'Tickets.xlsx';
  drawerVisible: boolean;
  drawerData: Ticket = new Ticket();
  uniqueDateArry: any = [];
  newData2: any = [];
  // userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));
  CREATION_DATE1: any;
  CREATION_DATE2: any;
  today = new Date();
  // orgName: string = this.api.ORGANIZATION_NAME;
  isButtonSpinning: boolean = false;

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  back() {
    this.router.navigate(['/masters/menu']);
  }
  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      this.CREATION_DATE1 == null ? this.today : this.CREATION_DATE1
    ) < 0;

  onFromDateChange(fromDate) {
    if (fromDate == null) this.CREATION_DATE1 = new Date();
    else this.CREATION_DATE1 = new Date(fromDate);
  }

  setDateForDeptWiseFilter() {
    this.CREATION_DATE = [];
    let currentDate = new Date();
    let previous6thDayDate = currentDate.setDate(currentDate.getDate() + -6);
    this.CREATION_DATE1 = new Date(previous6thDayDate);
    this.CREATION_DATE2 = new Date();
  }

  ngOnInit() {
    this.setDateForDeptWiseFilter();
    this.getTicketGroups();
    this.getSupportUsers();
    this.getSupportAgents();

    if (this.roleId == 6) this.getDepartmentToShowReport();

    if (this.roleId == 4) this.getDepartmentSupportAgentWise();

    if (this.roleId != 4 && this.roleId != 6) this.search(true);

    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }

  isDeleting: boolean = false;
  savedFilters: any;
  selectedFilter: string | null = null;
  isfilterapply: boolean = false;

  public commonFunction = new CommonFunctionService();
  // applyfilter(item) {
  //   this.filterClass = "filter-invisible";
  //   this.selectedFilter = item.ID;
  //   this.isfilterapply = true;
  //   this.filterQuery = " AND (" + item.FILTER_QUERY + ")";
  //   this.search(true);
  // }

  // deleteItem(item: any): void {
  //   this.isDeleting = true;
  //   this.api.deleteFilterById(item.ID).subscribe(
  //     (data) => {
  //       if (data["code"] == 200) {
  //         this.savedFilters = this.savedFilters.filter(
  //           (filter) => filter.ID !== item.ID
  //         );
  //         this.message.success("Filter deleted successfully.", "");
  //         this.isDeleting = false;
  //         this.isfilterapply = false;
  //         this.filterClass = "filter-invisible";

  //         this.loadFilters();
  //         this.filterQuery = "";
  //         this.search(true);
  //       } else {
  //         this.message.error("Failed to delete filter.", "");
  //         this.isDeleting = false;
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.loadingRecords = false;
  //       if (err.status === 0) {
  //         this.message.error(
  //           "Unable to connect. Please check your internet or server connection and try again shortly.",
  //           ""
  //         );
  //       } else {
  //         this.message.error("Something Went Wrong.", "");
  //       }
  //     }
  //   );
  // }

  // userId = sessionStorage.getItem("userId");
  // decrepteduserIDString = this.userId
  //   ? this.commonFunction.decryptdata(this.userId)
  //   : "";
  // USER_ID = parseInt(this.decrepteduserIDString, 10);
  // TabId: number;
  // loadFilters() {
  //   this.api
  //     .getFilterData1(
  //       0,
  //       0,
  //       "",
  //       "",
  //       ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
  //     ) // Use USER_ID as a number
  //     .subscribe(
  //       (response) => {
  //         if (response.code === 200) {
  //           this.savedFilters = response.data;
  //           this.filterQuery = "";
  //         } else {
  //           this.message.error("Failed to load filters.", "");
  //         }
  //       },
  //       (error) => {
  //         this.message.error("An error occurred while loading filters.", "");
  //       }
  //     );
  //   this.filterQuery = "";
  // }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  // toggleLiveDemo(query: any): void {
  //   this.selectedQuery = query.FILTER_QUERY;
  //   this.isModalVisible = true;
  // }

  // EditQueryData = [];
  // editButton: any;
  // FILTER_NAME: any;
  // drawerTitle: string = '';
  // drawerFilterVisible: boolean = false;

  // filterGroups: any[] = [
  //   {
  //     operator: "AND",
  //     conditions: [
  //       {
  //         condition: {
  //           field: "",
  //           comparator: "",
  //           value: "",
  //         },
  //         operator: "AND",
  //       },
  //     ],
  //     groups: [],
  //   },
  // ];

  // editQuery(data: any) {
  //   this.filterGroups = JSON.parse(data.FILTER_JSON);
  //   this.FILTER_NAME = data.FILTER_NAME;
  //   //
  //   this.EditQueryData = data;
  //   this.editButton = "Y";
  //   this.drawerTitle = "Edit Query";
  //   this.drawerFilterVisible = true;
  // }

  // Clearfilter() {
  //   this.filterClass = "filter-invisible";
  //   this.selectedFilter = "";
  //   this.isfilterapply = false;
  //   this.filterQuery = "";
  //   this.search();
  // }

  // openfilter() {
  //   this.drawerTitle = "Order wise job detailed Filter";
  //   this.drawerFilterVisible = true;

  //   // Edit code 2

  //   this.editButton = "N";
  //   this.FILTER_NAME = "";
  //   this.EditQueryData = [];

  //   this.filterGroups = [
  //     {
  //       operator: "AND",
  //       conditions: [
  //         {
  //           condition: {
  //             field: "",
  //             comparator: "",
  //             value: "",
  //           },
  //           operator: "AND",
  //         },
  //       ],
  //       groups: [],
  //     },
  //   ];
  // }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  getTicketGroups() {
    this.ticketGroups = [];

    this.api
      .getAllTicketGroups(
        0,
        0,
        'VALUE',
        'ASC',
        ' AND ORG_ID=1'
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.ticketGroups = data.body['data'];
          }
        },
        (err) => { }
      );
  }

  getSupportUsers() {
    this.supportUsers = [];

    // this.api.getbackOfficeDepartmentMapping(0, 0, 'ID', "ASC", ' AND BACKOFFICE_ID=' + this.userId).subscribe(data => {
    //   if (data['status'] == 200) {
    //     var supportAgentWiseDept = data.body['data'];
    //

    //     // for (var i = 0; i < supportAgentWiseDept.length; i++) {
    //     //   this.supportAgentWiseDeptArray.push(supportAgentWiseDept[i]['DEPARTMENT_ID']);
    //     // }

    //     if (this.roleId == 4) {
    //       this.search(true);
    //     }
    //   }
    // });

    const decryptedId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback

    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + decryptedId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          var departments = data.body['data'];

          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
  }

  getSupportAgents() {
    this.supportAgents = [];

    // this.api.getbackOfficeDepartmentMapping(0, 0, 'ID', "ASC", ' AND BACKOFFICE_ID=' + this.userId).subscribe(data => {
    //   if (data['status'] == 200) {
    //     var supportAgentWiseDept = data.body['data'];
    //

    //     // for (var i = 0; i < supportAgentWiseDept.length; i++) {
    //     //   this.supportAgentWiseDeptArray.push(supportAgentWiseDept[i]['DEPARTMENT_ID']);
    //     // }

    //     if (this.roleId == 4) {
    //       this.search(true);
    //     }
    //   }
    // });

    const decryptedId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback

    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + decryptedId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          var departments = data.body['data'];

          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
  }

  supportAgentWiseDeptArray = [];

  getDepartmentSupportAgentWise() {
    this.supportAgentWiseDeptArray = [];

    // this.api.getbackOfficeDepartmentMapping(0, 0, 'ID', "ASC", ' AND BACKOFFICE_ID=' + this.userId).subscribe(data => {
    //   if (data['status'] == 200) {
    //     var supportAgentWiseDept = data.body['data'];
    //

    //     // for (var i = 0; i < supportAgentWiseDept.length; i++) {
    //     //   this.supportAgentWiseDeptArray.push(supportAgentWiseDept[i]['DEPARTMENT_ID']);
    //     // }

    //     if (this.roleId == 4) {
    //       this.search(true);
    //     }
    //   }
    // });

    // const decryptedId = this.userId
    //   ? this.commonFunction.decryptdata(this.userId)
    // : '0'; // Decrypt userId or use '0' as fallback
    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + this.userId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          var departments = data.body['data'];

          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
  }

  deptWiseReport = [];

  getDepartmentToShowReport() {
    this.deptWiseReport = [];

    // this.api.getbackOfficeDepartmentMapping(0, 0, 'ID', "ASC", ' AND BACKOFFICE_ID=' + this.userId).subscribe(data => {
    //   if (data['status'] == 200) {
    //     var departments = data.body['data'];
    //

    //     // for (var i = 0; i < departments.length; i++) {
    //     //   this.deptWiseReport.push(departments[i]['DEPARTMENT_ID']);
    //     // }

    //     if (this.roleId == 6) {
    //       this.search(true);
    //     }
    //   }
    // });

    const decryptedId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback

    this.api
      .getbackOfficeDepartmentMapping(
        0,
        0,
        'ID',
        'ASC',
        ' AND BACKOFFICE_ID=' + decryptedId
      )
      .subscribe((data) => {
        if (data['status'] == 200) {
          var departments = data.body['data'];

          if (this.roleId == 6) {
            this.search(true);
          }
        }
      });
  }

  // exportexcel(): void {
  //   let element = document.getElementById('summer');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, this.fileName);
  // }

  // sort(sort: { key: string; value: string }): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }

  search(
    reset: boolean = false,
    exportToExcel: boolean = false,
    exportToPDF: boolean = false
  ) {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    let globalSearchQuery = '';

    // Global Search (using searchText)
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    this.loadingRecords = true;

    // var likeQuery = "";
    // if (this.searchText != "") {
    //   likeQuery = " AND (";

    //   this.columns.forEach(column => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    // }

    var supportAgentWiseDept = '';
    if (this.roleId == 4) {
      if (this.supportAgentWiseDeptArray.length > 0)
        supportAgentWiseDept =
          ' AND DEPARTMENT_ID IN (' + this.supportAgentWiseDeptArray + ')';
      else supportAgentWiseDept = '';
    }

    var deptAdminWiseDept = '';
    if (this.roleId == 6) {
      if (this.deptWiseReport.length > 0)
        deptAdminWiseDept =
          ' AND DEPARTMENT_ID IN (' + this.deptWiseReport + ')';
      else deptAdminWiseDept = '';
    }

    var creationDateFilter = '';
    if (this.CREATION_DATE1 != undefined && this.CREATION_DATE2 != undefined) {
      creationDateFilter =
        " AND DATE(DATE) BETWEEN '" +
        this.datePipe.transform(this.CREATION_DATE1, 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.CREATION_DATE2, 'yyyy-MM-dd') +
        "'";
    }

    var ticketGroupFilter = '';
    if (this.TICKET_GROUP.length > 0)
      ticketGroupFilter = ' AND TICKET_GROUP_ID IN (' + this.TICKET_GROUP + ')';

    var supportUserFilter = '';
    if (this.SUPPORT_USERS.length > 0)
      supportUserFilter =
        ' AND CREATOR_EMPLOYEE_ID IN (' + this.SUPPORT_USERS + ')';

    var supportAgentFilter = '';
    if (this.SUPPORT_AGENTS.length > 0)
      supportAgentFilter =
        ' AND TAKEN_BY_USER_ID IN (' + this.SUPPORT_AGENTS + ')';

    // var statusFilter = "";
    // if (this.STATUS.length > 0)
    //   statusFilter = " AND STATUS IN (" + this.STATUS + ")";

    if (this.ticketGroupText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_GROUP_VALUE LIKE '%${this.ticketGroupText.trim()}%'`;
      this.isticketgroupFilterApplied = true;
    } else {
      this.isticketgroupFilterApplied = false;
    }

    if (this.ticketNoText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_NO LIKE '%${this.ticketNoText.trim()}%'`;
      this.isticketnoFilterApplied = true;
    } else {
      this.isticketnoFilterApplied = false;
    }

    if (this.creatorempname !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `CREATOR_EMPLOYEE_NAME LIKE '%${this.creatorempname.trim()}%'`;
      this.iscreatorEmployeeFilterApplied = true;
    } else {
      this.iscreatorEmployeeFilterApplied = false;
    }

    if (this.questionText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `QUESTION LIKE '%${this.questionText.trim()}%'`;
      this.isQuestionFilterApplied = true;
    } else {
      this.isQuestionFilterApplied = false;
    }

    if (this.statusFilter1) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_TAKEN_STATUS = '${this.statusFilter1}'`;
    }

    if (this.tickettakememp !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TICKET_TAKEN_EMPLOYEE LIKE '%${this.tickettakememp.trim()}%'`;
      this.istickettakenempFilterApplied = true;
    } else {
      this.istickettakenempFilterApplied = false;
    }

    // if (this.priorityText !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") + `NAME LIKE '%${this.priorityText.trim()}%'`;
    //   this.ispriorityFilterApplied = true;
    // } else {
    //   this.ispriorityFilterApplied = false;
    // }

    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        const formattedStart = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(DATE) BETWEEN '${formattedStart}' AND '${formattedEnd}'`;
      }
    }

    if (this.lastRespondDate && this.lastRespondDate.length === 2) {
      const [start, end] = this.lastRespondDate;
      if (start && end) {
        const formattedStart1 = new Date(start).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEnd1 = new Date(end).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        likeQuery +=
          (likeQuery ? ' AND ' : '') +
          `DATE(LAST_RESPONDED) BETWEEN '${formattedStart1}' AND '${formattedEnd1}'`;
      }
    }

    if (this.priorityFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PRIORITY = '${this.priorityFilter}'`;
    }

    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = '${this.statusFilter}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    // likeQuery1 = globalSearchQuery;

    if (exportToExcel) {
      this.exportLoading = true;

      // this.api.getTicketGroupWiseTicketDetails(0, 0, '', this.sortKey, sort, likeQuery + creationDateFilter + ticketGroupFilter + supportUserFilter + supportAgentFilter + supportAgentWiseDept + deptAdminWiseDept + statusFilter + ' AND ORG_ID=' + this.cookie.get('orgId')).subscribe(data => {
      this.api
        .getTicketGroupWiseTicketDetails(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          ''
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.exportLoading = false;

              this.excelData = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.exportLoading = false;

              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.exportLoading = false;
          }
        );
    }
    // else if (exportToPDF) {
    //   this.exportInPDFLoading = true;
    //   // 0, 0, 'TICKET_GROUP_ID', 'desc', likeQuery + this.filterQuery, '', this.cookie.get('orgId')
    //   this.api.getTicketGroupWiseTicketDetails(0, 0, 'id', 'desc', likeQuery + creationDateFilter, '').subscribe(data => {
    //     if (data['status'] == 200) {
    //       this.exportInPDFLoading = false;
    //       this.dataListForExport = data.body['data'];
    //       this.isPDFModalVisible = true;
    //     }

    //   }, err => {
    //     if (err['ok'] == false)
    //       this.message.error("Server Not Found", "");
    //   });

    // }
    else {
      this.loadingRecords = true;

      // this.api.getTicketGroupWiseTicketDetails(this.pageIndex, this.pageSize, '', this.sortKey, sort, likeQuery + creationDateFilter + ticketGroupFilter + supportUserFilter + supportAgentFilter + supportAgentWiseDept + deptAdminWiseDept + statusFilter + ' AND ORG_ID=' + this.cookie.get('orgId')).subscribe(data => {
      this.api
        .getTicketGroupWiseTicketDetails(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery,
          ''
        )
        .subscribe(
          (data) => {
            if (data['status'] == 200) {
              this.totalRecords = data.body['count'];
              this.dataList = data.body['data'];
              this.TabId = data.body['TAB_ID'];
              this.excelData = data.body['data'];
              this.loadingRecords = false;
            } else if (data['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
            }
          },
          (err) => {
            if (err['status'] == 400) {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.dataList = [];
            }
          }
        );
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    this.CREATION_DATE1 = this.datePipe.transform(
      new Date(this.CREATION_DATE1),
      'yyyy-MM-dd'
    );
    this.CREATION_DATE2 = this.datePipe.transform(
      new Date(this.CREATION_DATE2),
      'yyyy-MM-dd'
    );
    if (
      (this.CREATION_DATE1 != null && this.CREATION_DATE2 != null) ||
      this.TICKET_GROUP.length > 0 ||
      this.SUPPORT_USERS.length > 0 ||
      this.SUPPORT_AGENTS.length > 0
    )
      this.isFilterApplied = 'primary';
    else this.isFilterApplied = 'default';

    this.search(true);
    this.filterClass = 'filter-invisible';
  }

  clearFilter() {
    this.TICKET_GROUP = [];
    this.SUPPORT_USERS = [];
    this.SUPPORT_AGENTS = [];
    this.filterQuery = '';
    this.CREATION_DATE = [];
    this.STATUS = [];
    this.setDateForDeptWiseFilter();
    this.search(true);
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.SELECT_ALL = false;
    this.SELECT_ALL1 = false;
    this.SELECT_ALL2 = false;
  }

  // @ViewChild(ChattdetailsicketComponent, { static: false }) ChattdetailsicketComponentVar: ChattdetailsicketComponent;
  grpid = 0;
  bread = [];
  newstr: string;
  GRPNAME = '';

  // viewTicketData(data: Ticket) {
  //   this.newData2 = [];
  //   this.data1 = [];
  //   // this.ChattdetailsicketComponentVar.loading = true;
  //   this.drawerTitle = "Ticket No. " + data.TICKET_NO;
  //   this.drawerData = Object.assign({}, data);
  //   var filterQuery1 = " AND TICKET_MASTER_ID = " + data.ID + "";

  //   this.api.getAllTicketDetails(0, 0, "CREATED_MODIFIED_DATE", "asc", filterQuery1).subscribe(data => {
  //     if (data['status'] == 200) {
  //       // this.ChattdetailsicketComponentVar.loading = false;
  //       this.totalRecords = data.body['count'];
  //       this.data1 = data.body['data'];
  //       this.grpid = this.data1[0]['TICKET_GROUP_ID'];

  //       // Getting Unique dates
  //       // for (var i = 0; i < this.data1.length; i++) {
  //       //   this.uniqueDateArry.push(this.datePipe.transform(this.data1[i]['CREATED_MODIFIED_DATE'], "yyyy-MM-dd"));
  //       // }

  //       this.uniqueDateArry = [...new Set(this.uniqueDateArry)];
  //       this.uniqueDateArry.sort();

  //       // this.uniqueDateArry.forEach(d1 => {
  //       //   this.newData2.push({
  //       //     key: d1, data: this.data1.filter(data =>
  //       //       this.datePipe.transform(data.CREATED_MODIFIED_DATE, "yyyy-MM-dd") == d1
  //       //     )
  //       //   });
  //       // });

  //       this.data1 = this.newData2;
  //       // this.ChattdetailsicketComponentVar.scrollIntoViewFunction();

  //       this.api.getBreadInChat(0, 0, 'ID', 'desc', '', '', 1).subscribe(data => {
  //         if (data['status'] == 200) {
  //           this.bread = data.body['data'];
  //
  //           this.newstr = '';
  //           this.GRPNAME = '';

  //           for (var i = 0; i < this.bread.length; i++) {
  //             this.GRPNAME = this.GRPNAME + '>' + this.bread[i]['VALUE'];
  //             var str = this.GRPNAME;
  //             this.newstr = str.replace('>', '');
  //           }
  //         }

  //       }, err => {
  //
  //       });
  //     }

  //   }, err => {
  //
  //   });

  //   this.drawerVisible = true;
  // }

  isloading = false;
  viewTicketData(data: Ticket) {
    this.isloading = true;
    this.newData2 = [];
    this.data1 = [];
    this.uniqueDateArry = [];
    // this.ChattdetailsicketComponentVar.loading = true;
    this.drawerTitle = 'Ticket No. ' + data.TICKET_NO;
    this.drawerData = Object.assign({}, data);
    var filterQuery1 = ' AND TICKET_MASTER_ID = ' + data.ID + '';

    this.api
      .getAllTicketDetails(0, 0, 'CREATED_MODIFIED_DATE', 'asc', filterQuery1)
      .subscribe(
        (data: HttpResponse<any>) => {
          if (data.status == 200) {
            data = data.body;
            // this.ViewchatticketComponentVar.isSpinning = false;
            this.totalRecords = data['count'];
            this.data1 = data['data'];
            this.isloading = false;

            // this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            if (data['count'] > 0) {
              this.grpid = this.data1[0]['TICKET_GROUP_ID'];
            } else {
              this.grpid = 0;
              // console.warn('No ticket data found for this ticket.');
            }

            // Getting Unique dates
            for (var i = 0; i < this.data1.length; i++) {
              this.uniqueDateArry.push(
                this.datePipe.transform(
                  this.data1[i]['CREATED_MODIFIED_DATE'],
                  'yyyy-MM-dd'
                )
              );
            }

            this.uniqueDateArry = [...new Set(this.uniqueDateArry)];
            this.uniqueDateArry.sort();

            this.uniqueDateArry.forEach((d1) => {
              this.newData2.push({
                key: d1,
                data: this.data1.filter(
                  (data) =>
                    this.datePipe.transform(
                      data.CREATED_MODIFIED_DATE,
                      'yyyy-MM-dd'
                    ) == d1
                ),
              });
            });

            this.data1 = this.newData2;
            // this.ViewchatticketComponentVar.scrollIntoViewFunction();

            this.api
              .getBreadInChat(0, 0, 'ID', 'desc', '', '', this.grpid)
              .subscribe(
                (data: HttpResponse<any>) => {
                  if (data.status == 200) {
                    data = data.body;
                    this.bread = data['data'];

                    this.newstr = '';
                    this.GRPNAME = '';

                    for (var i = 0; i < this.bread.length; i++) {
                      this.GRPNAME =
                        this.GRPNAME + '>' + this.bread[i]['VALUE'];
                      var str = this.GRPNAME;
                      this.newstr = str.replace('>', '');
                    }
                  }
                },
                (err) => { }
              );
          }
          this.isloading = false;
        },
        (err) => { }
      );

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onEnterKeyPress() {
    // document.getElementById("searchBtn").focus();
  }

  exportLoading: boolean = false;
  ticketGroupID2: any;
  employeeID2: any;
  supportAgentID2: any;
  status2: any;

  // importInExcel(ticketGroupID, employeeID, supportAgentID, status) {
  //   this.ticketGroupID2=ticketGroupID;
  //   this.employeeID2=employeeID;
  //   this.supportAgentID2=supportAgentID;
  //   this.status2=status;

  //   this.search(true, true);
  // }

  // convertInExcel() {
  //   var arry1 = [];
  //   var obj1: any = new Object();

  //   this.ticketGroupToPrint = "";
  //   this.employeeNameToPrint = "";
  //   this.supportAgentNameToPrint = "";
  //   this.statusToPrint = "";

  //   let tempTicketGroupName = "";
  //   let tempEmployeeName = "";
  //   let tempSupportAgentName = "";
  //   let tempStatus = "";

  //   for (var i = 0; i < this.ticketGroupID2.length; i++) {
  //     let ticketGroups = this.ticketGroups.filter(obj1 => {
  //       return obj1.ID == this.ticketGroupID2[i];
  //     });

  //     tempTicketGroupName = tempTicketGroupName + ticketGroups[0]["VALUE"] + ", ";
  //   }

  //   for (var i = 0; i < this.employeeID2.length; i++) {
  //     let supportUser = this.supportUsers.filter(obj1 => {
  //       return obj1.ID == this.employeeID2[i];
  //     });

  //     tempEmployeeName = tempEmployeeName + supportUser[0]["NAME"] + ", ";
  //   }

  //   for (var i = 0; i < this.supportAgentID2.length; i++) {
  //     let supportAgent = this.supportAgents.filter(obj1 => {
  //       return obj1.ID == this.supportAgentID2[i];
  //     });

  //     tempSupportAgentName = tempSupportAgentName + supportAgent[0]["NAME"] + ", ";
  //   }

  //   for (var i = 0; i < this.status2.length; i++) {
  //     let a = "";
  //     if (this.status2[i] == "'P'")
  //       a = "Pending";

  //     else if (this.status2[i] == "'C'")
  //       a = "Closed";

  //     else if (this.status2[i] == "'S'")
  //       a = "Assigned";

  //     else if (this.status2[i] == "'R'")
  //       a = "Answered";

  //     else if (this.status2[i] == "'O'")
  //       a = "Re-Open";

  //     else if (this.status2[i] == "'B'")
  //       a = "Banned";

  //     else if (this.status2[i] == "'H'")
  //       a = "On-Hold";

  //     tempStatus = tempStatus + a + ", ";
  //   }

  //   this.ticketGroupToPrint = tempTicketGroupName.substring(0, tempTicketGroupName.length - 2);
  //   this.employeeNameToPrint = tempEmployeeName.substring(0, tempEmployeeName.length - 2);
  //   this.supportAgentNameToPrint = tempSupportAgentName.substring(0, tempSupportAgentName.length - 2);
  //   this.statusToPrint = tempStatus.substring(0, tempStatus.length - 2);

  //   for (var i = 0; i < this.dataListForExport.length; i++) {
  //     obj1['Ticket Group Name'] = this.dataListForExport[i]['TICKET_GROUP_VALUE'];
  //     obj1['Ticket No.'] = this.dataListForExport[i]['TICKET_NO'];
  //     obj1['Created On'] = this.datePipe.transform(this.dataListForExport[i]['DATE'], 'dd MMM yyyy hh:mm a');
  //     obj1['Created By'] = this.dataListForExport[i]['CREATOR_EMPLOYEE_NAME'];
  //     obj1['Question'] = this.dataListForExport[i]['QUESTION'];
  //     obj1['Is Taken'] = this.dataListForExport[i]['IS_TAKEN_STATUS'];
  //     obj1['Taken By/ Transfer To'] = this.dataListForExport[i]['TICKET_TAKEN_EMPLOYEE'];
  //     obj1['Last Responded Date'] = this.datePipe.transform(this.dataListForExport[i]['LAST_RESPONDED'], 'dd MMM yyyy hh:mm a');
  //     obj1['Priority'] = this.getPriorityInFullForm(this.dataListForExport[i]['PRIORITY']);
  //     obj1['Status'] = this.getStatusInFullForm(this.dataListForExport[i]['STATUS']);

  //     arry1.push(Object.assign({}, obj1));

  //     if (i == this.dataListForExport.length - 1) {

  //       var params = []
  //       params.push('User : ' + this.getUserName());
  //       params.push('' + this.formTitle);
  //       params.push('Date : ' + this.datePipe.transform(this.getCurrentDateTime(), 'dd MMM yyyy hh:mm:ss a'));

  //       var filters = []
  //       filters.push('Date : ' + this.datePipe.transform(this.CREATION_DATE1, 'dd MMM yyyy ') + ' - ' + this.datePipe.transform(this.CREATION_DATE2, 'dd MMM yyyy'));
  //       filters.push('Ticket Group(s): ' + this.getTicketGroupToShow());
  //       filters.push('Employee Name(s) : ' + this.getEmployeeToShow());
  //       filters.push('Support Agent(s) : ' + this.getSupportAgentToShow());
  //       filters.push('Status : ' + this.getStatusToShow());

  //       this._exportService.exportExcel(arry1, 'ticket group Wise Ticket Details ' + this.datePipe.transform(new Date(), 'dd-MMM-yy'), params, filters);
  //     }
  //   }
  // }

  excelData: any[];

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        // obj1["Feedback Date"] = this.excelData[i]["FEEDBACK_DATE_TIME"]
        //   ? this.datepipe.transform(
        //     this.excelData[i]["FEEDBACK_DATE_TIME"],
        //     "dd/MM/yyyy hh:mm a"
        //   )
        //   : "-";

        obj1['Ticket Group Name'] = this.excelData[i]['TICKET_GROUP_VALUE'];
        obj1['Ticket No.'] = this.excelData[i]['TICKET_NO'];
        obj1['Created On'] = this.excelData[i]['DATE']
          ? this.datePipe.transform(this.excelData[i]['DATE'], 'dd/MM/yyyy')
          : '-';
        obj1['Created By'] = this.excelData[i]['CREATOR_EMPLOYEE_NAME']
          ? this.excelData[i]['CREATOR_EMPLOYEE_NAME']
          : '-';
        obj1['Question'] = this.excelData[i]['QUESTION'];
        obj1['Is Taken'] = this.excelData[i]['IS_TAKEN_STATUS'];
        obj1['Taken By/ Transfer To'] = this.excelData[i][
          'TICKET_TAKEN_EMPLOYEE'
        ]
          ? this.excelData[i]['TICKET_TAKEN_EMPLOYEE']
          : '-';
        obj1['Last Responded Date'] = this.excelData[i]['LAST_RESPONDED']
          ? this.datePipe.transform(
            this.excelData[i]['LAST_RESPONDED'],
            'dd/MM/yyyy hh:mm a'
          )
          : '-';
        obj1['Priority'] = this.getPriorityInFullForm(
          this.excelData[i]['PRIORITY']
        );
        obj1['Status'] = this.getStatusInFullForm(this.excelData[i]['STATUS']);

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Ticket Group Wise Detailed Report ' +
            this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('There is a No Data', '');
    }
  }

  getPriorityInFullForm(priorityCode: string): string {
    // Implement your logic to convert the priority code to full form
    if (priorityCode === 'H') return 'High';
    if (priorityCode === 'M') return 'Medium';
    if (priorityCode === 'L') return 'Low';
    if (priorityCode === 'VH') return 'Very High';
    if (priorityCode === 'VL') return 'Very Low';
    return '-';
  }

  getStatusInFullForm(priorityCode: string): string {
    // Implement your logic to convert the priority code to full form
    if (priorityCode === 'P') return 'Pending';
    if (priorityCode === 'C') return 'Closed';
    if (priorityCode === 'S') return 'Assigned';
    if (priorityCode === 'R') return 'Answered';
    if (priorityCode === 'O') return 'Re Opene';
    if (priorityCode === 'B') return 'Banned';
    if (priorityCode === 'H') return 'On Hold';
    return '-';
  }

  // getStatusInFullForm(status) {
  //   if (status == "P")
  //     return "Pending";

  //   else if (status == "C")
  //     return "Closed";

  //   else if (status == "S")
  //     return "Assigned";

  //   else if (status == "R")
  //     return "Answered";

  //   else if (status == "O")
  //     return "Re - Open";

  //   else if (status == "B")
  //     return "Banned";

  //   else if (status == "H")
  //     return "On - Hold";
  // }

  // getPriorityInFullForm(status) {
  //   if (status == "V")
  //     return "Very High";

  //   else if (status == "H")
  //     return "High";

  //   else if (status == "M")
  //     return "Medium";

  //   else if (status == "L")
  //     return "Low";

  //   else if (status == "O")
  //     return "Very Low";
  // }

  isPDFModalVisible: boolean = false;
  PDFModalTitle: string = 'Export in PDF';
  exportInPDFLoading: boolean = false;
  ticketGroupToPrint: string = '';
  employeeNameToPrint: string = '';
  supportAgentNameToPrint: string = '';
  statusToPrint: string = '';

  // handlePDFModalCancel() {
  //   this.isPDFModalVisible = false;
  // }

  // getCurrentDateTime() {
  //   return new Date();
  // }

  getUserName() {
    return this.api.userName;
  }

  getTicketGroupToShow() {
    if (
      this.ticketGroupToPrint == '' ||
      this.TICKET_GROUP.length == this.ticketGroups.length
    )
      return 'All';
    else return this.ticketGroupToPrint;
  }

  getEmployeeToShow() {
    if (
      this.employeeNameToPrint == '' ||
      this.SUPPORT_USERS.length == this.supportUsers.length
    )
      return 'All';
    else return this.employeeNameToPrint;
  }

  getSupportAgentToShow() {
    if (
      this.supportAgentNameToPrint == '' ||
      this.SUPPORT_AGENTS.length == this.supportAgents.length
    )
      return 'All';
    else return this.supportAgentNameToPrint;
  }

  getStatusToShow() {
    if (this.statusToPrint == '') return 'All';
    else return this.statusToPrint;
  }

  pdfDownload: boolean = false;

  public generatePDF() {
    this.isButtonSpinning = true;

    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'yyyy-MM-dd');
    var dates = this.datePipe.transform(date, 'h:mm:ss a');
    var data = document.getElementById('print');
    html2pdf()
      .from(data)
      .set({
        margin: [16, 13, 12, 13],

        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'landscape' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        var totalPages = pdf.internal.getNumberOfPages();
        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }
      })
      .save(this.formTitle + '_' + datef + '_' + dates + '.pdf');
  }

  SELECT_ALL: boolean = false;
  onSelectAllChecked(event) {
    this.SELECT_ALL = event;
    //
    let ids = [];
    if (this.SELECT_ALL == true) {
      for (var i = 0; i < this.ticketGroups.length; i++) {
        ids.push(this.ticketGroups[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.TICKET_GROUP = ids;
  }
  SELECT_ALL1: boolean = false;
  onSelectAllChecked1(event) {
    this.SELECT_ALL1 = event;
    //
    let ids = [];
    if (this.SELECT_ALL1 == true) {
      for (var i = 0; i < this.supportUsers.length; i++) {
        ids.push(this.supportUsers[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.SUPPORT_USERS = ids;
  }
  SELECT_ALL2: boolean = false;
  onSelectAllChecked2(event) {
    this.SELECT_ALL2 = event;
    //
    let ids = [];
    if (this.SELECT_ALL2 == true) {
      for (var i = 0; i < this.supportAgents.length; i++) {
        ids.push(this.supportAgents[i]['ID']);
        //
      }
    } else {
      ids = [];
    }
    this.SUPPORT_AGENTS = ids;
  }
  onSelectOff(event) {
    var a = this.ticketGroups.length;
    var b = this.ticketGroups.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL = false;
    } else {
      this.SELECT_ALL = true;
    }
    this.TICKET_GROUP = event;
    if (this.TICKET_GROUP.length == 0) {
      this.SELECT_ALL = false;
    }
  }
  onSelectOff1(event) {
    var a = this.supportUsers.length;
    var b = this.supportUsers.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL1 = false;
    } else {
      this.SELECT_ALL1 = true;
    }
    this.SUPPORT_USERS = event;
    if (this.SUPPORT_USERS.length == 0) {
      this.SELECT_ALL1 = false;
    }
  }

  onSelectOff2(event) {
    var a = this.supportAgents.length;
    var b = this.supportAgents.length - event.length;
    if ((a! = b)) {
      this.SELECT_ALL2 = false;
    } else {
      this.SELECT_ALL2 = true;
    }
    this.SUPPORT_AGENTS = event;
    // if(this.SUPPORT_AGENTS.length == -1)
    // {
    //   this.SELECT_ALL2=false;
    // }
    if (this.SUPPORT_AGENTS.length == 0) {
      this.SELECT_ALL2 = false;
    }
  }

  importInExcel() {
    this.search(true, true);
  }

  // showMainFilter() {
  //   if (this.filterClass === "filter-visible") {
  //     this.filterClass = "filter-invisible";
  //   } else {
  //     this.filterClass = "filter-visible";
  //     this.loadFilters();
  //   }
  // }

  onKeyup(keys) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }

    if (this.ticketGroupText.length >= 3 && keys.key === 'Enter') {
      this.search();
      // this.isticketgroupFilterApplied = true;
    } else if (this.ticketGroupText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isticketgroupFilterApplied = false;
    }

    if (this.ticketNoText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isticketnoFilterApplied = true;
    } else if (this.ticketNoText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isticketnoFilterApplied = false;
    }

    if (this.creatorempname.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.istickettakenempFilterApplied = true;
    } else if (this.creatorempname.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.istickettakenempFilterApplied = false;
    }

    if (this.questionText.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.isQuestionFilterApplied = true;
    } else if (this.ticketGroupText.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.isQuestionFilterApplied = false;
    }

    if (this.tickettakememp.length >= 3 && keys.key === 'Enter') {
      this.search();
      this.istickettakenempFilterApplied = true;
    } else if (this.tickettakememp.length == 0 && keys.key === 'Backspace') {
      this.search();
      this.istickettakenempFilterApplied = false;
    }

    // if (this.priorityText.length >= 0 && keys.key === "Enter") {
    //   this.search();
    //   this.ispriorityFilterApplied = true;
    // } else if (this.priorityText.length == 0 && keys.key === "Backspace") {
    //   this.search();
    //   this.ispriorityFilterApplied = false;
    // }

    // if (this.totalText.length >= 0 && keys.key === "Enter") {
    //   this.search();
    //   this.istotalFilterApplied = true;
    // } else if (this.totalText.length == 0 && keys.key === "Backspace") {
    //   this.search();
    //   this.istotalFilterApplied = false;
    // }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  reset(): void {
    this.searchText = '';
  }

  ticketGroupText: string = '';
  ticketGroupVisible = false;
  isticketgroupFilterApplied: boolean = false;

  ticketNoText: string = '';
  ticketnoVisible = false;
  isticketnoFilterApplied: boolean = false;

  StartDate: any = [];
  dateVisible = false;
  isdateFilterApplied: boolean = false;

  creatorempname: string = '';
  creatorEmployeeNameVisible = false;
  iscreatorEmployeeFilterApplied: boolean = false;

  questionText: string = '';
  questionVisible = false;
  isQuestionFilterApplied: boolean = false;

  lastRespondDate: any = [];
  lastrespondedDateVisible = false;
  islastrespondedDateFilterApplied: boolean = false;

  tickettakememp: string = '';
  tickettakenempVisible = false;
  istickettakenempFilterApplied: boolean = false;

  priorityText: string = '';
  piorityVisible = false;
  ispriorityFilterApplied: boolean = false;

  onDateRangeChange(): void {
    if (this.StartDate && this.StartDate.length === 2) {
      const [start, end] = this.StartDate;
      if (start && end) {
        this.search();
        // this.isdateFilterApplied = true;
      }
    } else {
      this.StartDate = null; // or [] if you prefer
      this.search();
      // this.isdateFilterApplied = false;
    }
  }

  onDateRangeChange1(): void {
    if (this.lastRespondDate && this.lastRespondDate.length === 2) {
      const [start, end] = this.lastRespondDate;
      if (start && end) {
        this.search();
        this.islastrespondedDateFilterApplied = true;
      }
    } else {
      this.lastRespondDate = null; // or [] if you prefer
      this.search();
      this.islastrespondedDateFilterApplied = false;
    }
  }

  listOfFilter: any[] = [
    { text: 'Pending', value: 'P' },
    { text: 'Closed', value: 'C' },
    { text: 'Assigned', value: 'S' },
    { text: 'Answered', value: 'R' },
    { text: 'Re-Open', value: 'O' },
    { text: 'Banned', value: 'B' },
    { text: 'On-Hold', value: 'H' },
  ];

  listOfisStatusFilter: any[] = [
    { text: 'Yes', value: 'Yes' },
    { text: 'No', value: 'No' },
  ];

  listOfpriorityFilter: any[] = [
    { text: 'Very High', value: 'VH' },
    { text: 'High', value: 'H' },
    { text: 'Medium', value: 'M' },
    { text: 'Low', value: 'L' },
    { text: 'Very Low', value: 'VL' },
  ];

  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  statusFilter1: string | undefined = undefined;
  showiscloumnVisible: boolean = false;
  onIsStatusFilterChange(selectedStatus: string) {
    this.statusFilter1 = selectedStatus;
    this.search(true);
  }

  priorityFilter: string | undefined = undefined;
  showcpriorityVisible: boolean = false;
  onpriorityChange(selectedStatus: string) {
    this.priorityFilter = selectedStatus;
    this.search(true);
  }

  TabId: number;
  // public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';

  USER_ID = parseInt(this.decrepteduserIDString, 10);
  // isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  // filterQuery: string = "";
  // filterClass: string = "filter-invisible";
  // savedFilters: any[] = [];

  filterGroups: any[] = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];

  //New Advance Filter

  filterData: any;
  currentClientId = 1; // Set the client ID

  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  filterloading: boolean = false;

  whichbutton: any;
  updateButton: any;
  updateBtn: any;

  loadFilters() {
    this.filterloading = true;

    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;




            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') {
                sessionStorage.removeItem('ID');
              }
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (element: any) =>
                    Number(element.ID) === Number(sessionStorage.getItem('ID'))
                );


                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA') {
                  this.applyfilter(this.savedFilters[0]);
                }
              }

              this.whichbutton = '';
              this.updateBtn = '';
            }
            // else if (this.whichbutton == 'SA') {
            //   this.applyfilter(this.savedFilters[0]);
            // }

            this.filterQuery = '';
          } else {
            this.filterloading = false;
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }

  drawerTitle!: string;
  openfilter() {
    this.drawerTitle = 'Ticket Group Wise Details Filter';
    this.drawerFilterVisible = true;

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

    // Edit code 2

    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];

    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];

    this.filterGroups2 = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
  }

  drawerflterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;
    this.loadFilters();

    this.whichbutton = buttontype;
    this.updateBtn = updateButton;

    if (buttontype == 'SA') {



      this.loadFilters();
    } else if (buttontype == 'SC') {

      this.loadFilters();
    }
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'TICKET_GROUP_VALUE',
      label: 'Ticket Group Value',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Group Value',
    },

    {
      key: 'TICKET_NO',
      label: 'Ticket Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Ticket Number',
    },
    {
      key: 'DATE',
      label: 'Date',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Date',
    },
    {
      key: 'CREATOR_EMPLOYEE_NAME',
      label: 'Creator Employee Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Creator Employee Name',
    },
    {
      key: 'QUESTION',
      label: 'Question',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Question',
    },
    {
      key: 'IS_TAKEN_STATUS',
      label: 'Is Taken Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      placeholder: 'Enter Is Taken Status',
    },
    {
      key: 'TICKET_TAKEN_EMPLOYEE',
      label: 'Ticket Taken Emploee',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Yes', value: '1' },
        { display: 'No', value: '0' },
      ],
      placeholder: 'Enter Ticket Taken Emploee',
    },
    {
      key: 'LAST_RESPONDED',
      label: 'Last Responded',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Last Responded',
    },
    {
      key: 'PRIORITY',
      label: 'Priority',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { display: 'Very High', value: 'VH' },
        { display: 'High', value: 'H' },
        { display: 'Medium', value: 'M' },
        { display: 'Low', value: 'L' },
        { display: 'Very Low', value: 'VL' },
      ],
      placeholder: 'Enter Priority',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { displaay: 'Pending', value: 'P' },
        { displaay: 'Closed', value: 'C' },
        { displaay: 'Assigned', value: 'S' },
        { displaay: 'Answered', value: 'R' },
        { displaay: 'Re-Open', value: 'O' },
        { displaay: 'Banned', value: 'B' },
        { displaay: 'On-Hold', value: 'H' },
      ],
      placeholder: 'Enter Status',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }

  // isDeleting: boolean = false;

  deleteItem(item: any): void {
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';

          this.loadFilters();
          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);
          }
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            'Unable to connect. Please check your internet or server connection and try again shortly.',
            ''
          );
        } else {
          this.message.error('Something Went Wrong.', '');
        }
      }
    );
  }

  // selectedFilter: string | null = null;
  // filterQuery = '';
  applyfilter(item) {

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  // isModalVisible = false;
  // selectedQuery: string = "";

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Query';
    this.drawerFilterVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
}
