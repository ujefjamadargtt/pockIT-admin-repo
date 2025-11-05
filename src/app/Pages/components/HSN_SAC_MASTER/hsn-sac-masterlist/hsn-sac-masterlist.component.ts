import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { HSN_SAC_Master } from "src/app/Pages/Models/HSN_SAC_Master";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";

@Component({
  selector: "app-hsn-sac-masterlist",
  templateUrl: "./hsn-sac-masterlist.component.html",
  styleUrls: ["./hsn-sac-masterlist.component.css"],
})
export class HSNSACMASTERlistComponent {
  formTitle = "Manage HSN Codes";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";

  hsnVisible: boolean = false;
  hsndescVisible: boolean = false;

  isDescFilterApplied: boolean = false;
  hsndesctext: string = "";

  hsnshortcodetext: string = "";
  hsnshortcodeVisible: boolean = false;

  hsnsequenceNotext: string = "";
  hsnSeqVisible: boolean = false;

  isSeqNoFilterApplied: boolean = false;

  isShortCodeFilterApplied: boolean = false;

  filterloading: boolean = false;
  // Edit Code 3
  filterGroups: any[] = [
    {
      operator: "AND",
      conditions: [
        {
          condition: {
            field: "",
            comparator: "",
            value: "",
          },
          operator: "AND",
        },
      ],
      groups: [],
    },
  ];


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

  columns: string[][] = [
    ["DESCRIPTION", "Description"],
    ["CODE", "short code"],
  ];
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: HSN_SAC_Master = new HSN_SAC_Master();

  data: HSN_SAC_Master = new HSN_SAC_Master();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit() { }

  keyup(event: any) {
    this.search();
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || "id";
    const sortOrder = (currentSort && currentSort.value) || "desc";
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

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info("Please enter atleast 3 characters to search", "");
    }
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc";
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }

    var likeQuery = "";
    var globalSearchQuery = "";
    // Global Search (using searchText)
    if (this.searchText !== "") {
      globalSearchQuery =
        " AND (" +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(" OR ") +
        ")";
    }

    this.loadingRecords = true;

    if (this.hsndesctext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `DESCRIPTION LIKE '%${this.hsndesctext.trim()}%'`;
      this.isDescFilterApplied = true;
    } else {
      this.isDescFilterApplied = false;
    }

    if (this.hsnshortcodetext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `CODE LIKE '%${this.hsnshortcodetext.trim()}%'`;
      this.isShortCodeFilterApplied = true;
    } else {
      this.isShortCodeFilterApplied = false;
    }

    // Seq No Filter
    if (this.hsnsequenceNotext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `SEQ_NO LIKE '%${this.hsnsequenceNotext.trim()}%'`;
      this.isSeqNoFilterApplied = true;
    } else {
      this.isSeqNoFilterApplied = false;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");

    this.api
      .getAllHSNSAC(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.loadingRecords = false;
            this.TabId = data["TAB_ID"];
            this.totalRecords = data["count"];
            this.dataList = data["data"];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              "Network error: Please check your internet connection.",
              ""
            );
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error("Something Went Wrong.", "");
          }
        }
      );
  }


  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }


  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerData = new HSN_SAC_Master();
    this.drawerTitle = "Add New HSN Code";
    this.drawerData.STATUS = true;
    this.drawerVisible = true;

    this.api.getAllHSNSAC(1, 1, "SEQ_NO", "desc", "").subscribe(
      (data) => {
        if (data["code"] == 200) {
          if (data["count"] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
          }
          this.drawerVisible = true;
        } else {
          this.message.error("Something Went Wrong", "");
        }
      },
      () => { }
    );
  }
  edit(data: HSN_SAC_Master): void {
    this.drawerTitle = "Update HSN Code";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  back() {
    this.router.navigate(["/masters/menu"]);
  }

  onKeyup(event: KeyboardEvent, type: string): void {
    if (
      type == "search" &&
      this.searchText.length >= 3 &&
      event.key === "Enter"
    ) {
      this.search();
    } else if (
      type == "search" &&
      this.searchText.length == 0 &&
      event.key === "Backspace"
    ) {
      this.search();
    }

    if (
      type == "code" &&
      this.hsnshortcodetext.length >= 3 &&
      event.key === "Enter"
    ) {
      this.search();
      // this.isShortCodeFilterApplied = true;
    } else if (
      type == "code" &&
      this.hsnshortcodetext.length == 0 &&
      event.key === "Backspace"
    ) {
      this.search();
      // this.isShortCodeFilterApplied = false;
    }

    if (
      type == "desc" &&
      this.hsndesctext.length >= 3 &&
      event.key === "Enter"
    ) {
      this.search();
      // this.isDescFilterApplied = true;
    } else if (
      type == "desc" &&
      this.hsndesctext.length == 0 &&
      event.key === "Backspace"
    ) {
      this.search();
      // this.isDescFilterApplied = true;
    }

    if (
      type == "seqNo" &&
      this.hsnsequenceNotext.length >= 1 &&
      event.key === "Enter"
    ) {
      this.search();
      // this.isSeqNoFilterApplied = true;
    } else if (
      type == "seqNo" &&
      this.hsnsequenceNotext.length == 0 &&
      event.key === "Backspace"
    ) {
      this.search();
      // this.isSeqNoFilterApplied = false;
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById("button");
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  reset(): void {
    this.searchText = "";
    this.hsndesctext = "";
    this.hsnshortcodetext = "";
    this.search();
  }
  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem("userId");
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : "";
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterClass: string = "filter-invisible";
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
      this.loadFilters();
    }
  }


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
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';

          this.loadFilters();


          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);

          }
          else {
            this.isfilterapply = true;
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


  drawerfilterClose(buttontype, updateButton): void {


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
    return this.drawerfilterClose.bind(this);
  }



  filterData: any;
  currentClientId = 1
  openfilter() {
    this.drawerTitle = 'HSN Codes Filter';
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



  filterFields: any[] = [
    {
      key: "CODE",
      label: "Code",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Code",
    },

    {
      key: "DESCRIPTION",
      label: "Description",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Description",
    },
    {
      key: "SEQ_NO",
      label: "Sequence Number",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Sequence Number",
    },

    {
      key: "STATUS",
      label: "Status",
      type: "select",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: "1", display: "Yes" },
        { value: "0", display: "No" },
      ],
      placeholder: "Select Status",
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  isDeleting: boolean = false;


  selectedFilter: string | null = null;
  // filterQuery = '';

  applyfilter(item) {

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }



  isModalVisible = false;
  selectedQuery: string = "";

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
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }


  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = "";
  }

  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: "Yes", value: "1" },
    { text: "No", value: "0" },
  ];

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  shouldTruncateAt25(value: string): boolean {
    const mCount = (value.match(/m/g) || []).length; // Count the number of 'm's
    return value.length > 35 && mCount > 6; // Truncate at 25 if length > 25 and 'm' count > 4
  }
}
