import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { CustmoerCategoryData } from "src/app/Pages/Models/CustomerCategoryMaster";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";

@Component({
  selector: "app-customer-category-master",
  templateUrl: "./customer-category-master.component.html",
  styleUrls: ["./customer-category-master.component.css"],
})
export class CustomerCategoryMasterComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  formTitle = "Manage Customer Categories";
  searchText: string = "";
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = "NAME";
  sortValue: string = "desc";
  loadingRecords = false;
  totalRecords = 1;
  Category: any[] = [];
  columns: string[][] = [["NAME", "NAME"], ["DESCRIPTION", "DESCRIPTION"]];
  drawerCategoryMappingVisible = false;
  drawerTitle = "Add New Cumtomer Category";
  drawerData: CustmoerCategoryData = new CustmoerCategoryData();
  drawervisible = false;
  isCategoryNameFilterApplied = false;
  isCategoryDescFilterApplied = false;

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

  ngOnInit(): void {
    if (this.searchText.length > 3) {
      this.search();
    } else if (this.searchText.length == 0) {
      this.search();
    }
  }

  back() {
    this.router.navigate(["/masters/menu"]);
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

  onInputChange(value: string): void {
    if (value.length >= 3 || value.length === 0) {
      this.search();
    }
  }
  search(reset: boolean = false) {
    if (
      this.searchText.trim().length < 3 &&
      this.searchText.trim().length !== 0
    ) {
      return;
    }
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
    // if (this.searchText != "") {
    //   likeQuery = " AND";
    //   this.columns.forEach((column) => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    // }
    // Country Filter
    let globalSearchQuery = "";
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
    if (this.CategoryText !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `NAME LIKE '%${this.CategoryText.trim()}%'`;
      this.isCategoryNameFilterApplied = true;
    } else {
      this.isCategoryNameFilterApplied = false;
    }
    // Description
    if (this.DescriptionText !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `DESCRIPTION LIKE '%${this.DescriptionText.trim()}%'`;
      this.isCategoryDescFilterApplied = true;
    } else {
      this.isCategoryDescFilterApplied = false;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    this.loadingRecords = true;
    // Combine global search query and column-specific search query

    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
    this.api
      .getCustomerCategeroyData(
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
            this.Category = data["data"];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.Category = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.Category = [];
            this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              "Unable to connect. Please check your internet or server connection and try again shortly.",
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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

  drawerClose(): void {
    this.search();
    this.drawervisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerChapterMappingClose(): void {
    this.drawerCategoryMappingVisible = false;
  }

  get closeChapterMappingCallback() {
    return this.drawerChapterMappingClose.bind(this);
  }
  edit(data: CustmoerCategoryData): void {
    this.drawerTitle = "Update Customer Category";
    this.drawerData = Object.assign({}, data);
    this.drawervisible = true;
  }

  add(): void {
    this.drawerTitle = "Add New Customer Category";
    this.drawerData = new CustmoerCategoryData();
    this.drawervisible = true;
    this.api.getCustomerCategeroyData(1, 1, "", "desc", "").subscribe(
      (data) => {
        if (data["code"] == 200) {
          // if (data["count"] == 0) {
          //   this.drawerData.SEQ_NO = 1;
          // } else {
          //   this.drawerData.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
          // }
        } else {
          this.message.error("Server Not Found.", "");
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          // Network error
          this.message.error(
            "Unable to connect. Please check your internet or server connection and try again shortly.",
            ""
          );
          // this.dataList = [];
        } else {
          // Other errors
          this.message.error("Something Went Wrong.", "");
        }
      }
    );
  }
  //For Input
  DescriptionText: string = "";
  CategoryVisible = false;
  CategoryText: string = "";
  DescriptionVisible = false;
  keyup(keys) {
    // if (this.searchText.length >= 3) {
    //   this.search();
    // }
    // else if (this.searchText.length === 0) {
    //   this.dataList = []
    //   this.search()
    // }
    const element = window.document.getElementById("button");
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
  }

  onKeyup(event: KeyboardEvent): void {
    const element = window.document.getElementById("button");
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && event.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
    if (this.CategoryText.length >= 3 && event.key === "Enter") {
      this.search();
    } else if (this.CategoryText.length == 0 && event.key === "Backspace") {
      this.search();
    }
    if (this.DescriptionText.length >= 3 && event.key === "Enter") {
      this.search();
    } else if (this.DescriptionText.length == 0 && event.key === "Backspace") {
      this.search();
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  reset(): void {
    this.searchText = "";
    this.DescriptionText = "";
    this.CategoryText = "";
    this.search();
  }
  //status Filter
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  dataList: any = [];

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
  filterQuery: string = "";
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

  filterloading: boolean = false;




  openfilter() {
    this.drawerTitle = "Customer Categories Filter";
    this.drawerFilterVisible = true;

    // Edit code 2

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


  isDeleting: boolean = false;
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

  applyfilter(item) {

    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
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
      key: "NAME",
      label: "Customer Category Name",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Customer Category Name",
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
      key: "IS_ACTIVE",
      label: "Status",
      type: "select",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: "Select Status",
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }




  selectedFilter: string | null = null;
  // filterQuery = '';


  isModalVisible = false;
  selectedQuery: string = "";

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = "";
  }
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
}
