import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { DashboardMaster } from "src/app/Pages/Models/dashboardmaster";
import { TemplateCategoryMaster } from "src/app/Pages/Models/templateCategory";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
@Component({
  selector: 'app-dashboard-master-table',
  templateUrl: './dashboard-master-table.component.html',
  styleUrls: ['./dashboard-master-table.component.css']
})
export class DashboardMasterTableComponent {
  drawerVisible: boolean = false;
  drawerData: DashboardMaster = new DashboardMaster();
  searchText: string = "";
  formTitle = "Manage Dashboard";
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "TITLE";
  chapters: any = [];
  isLoading = true;
  columns: string[][] = [
    ["NAME", "NAME"],
    ["TITLE", "TITLE"],
    ["SNAPSHOT_LINK", "SNAPSHOT_LINK"],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;
  isRoleFIlterApplied: boolean = false;
  ROLEvISIBLE: boolean = false;
  roles: any = [];
  namevisible = false;
  roleVisible = false;
  descriptionvisible = false;
  selectedBranches: number[] = [];
  branchVisible = false;
  seqno: string = "";
  Name: string = "";
  Description: string = "";
  seqvisible = false;
  distvisible = false;
  countryVisible: boolean = false;
  selectedCountries: number[] = [];
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  isfilterapply: boolean = false;
  filterClass: string = "filter-invisible";
  filterQuery: string = "";
  visible = false;
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
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  keyup(event) {
    if (this.searchText.length >= 3 && event.key === "Enter") {
      this.search();
    } else if (this.searchText.length == 0 && event.key === "Backspace") {
      this.search();
    }
  }
  onKeyupS(keys) {
    const element = window.document.getElementById("button");
    if (element != null) element.focus();
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
  }
  isseqapply = false;
  isDistApplied = false;
  isDistapply = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.Name.length >= 3 && event.key === "Enter") {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.Name.length == 0 && event.key === "Backspace") {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.Description.length >= 3 && event.key === "Enter") {
      this.search();
      this.isDistapply = true;
    } else if (this.Description.length == 0 && event.key === "Backspace") {
      this.search();
      this.isDistapply = false;
    }
  }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : "0"; 
    this.USER_ID = Number(decryptedUserId);
    this.getRole();
    this.getRoleData();
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
  roleData: any = [];
  getRole() {
    this.api
      .getAllRoles(0, 0, '', '', '')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.roleData = data['data'];
        } else {
          this.roleData = [];
        }
      });
  }
  roleData1: any = [];
  getRoleData() {
    this.api
      .getAllRoles(0, 0, '', '', '')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.roleData1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  isStateFilterApplied = false;
  onBranchChange(): void {
    if (this.selectedBranches?.length) {
      this.search();
      this.isStateFilterApplied = true; 
    } else {
      this.search();
      this.isStateFilterApplied = false; 
    }
  }
  isnameFilterApplied = false;
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.isnameFilterApplied = true; 
    } else {
      this.search();
      this.isnameFilterApplied = false; 
    }
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset(): void {
    this.searchText = "";
    this.Name = "";
    this.Description = "";
    this.seqno = "";
    this.search();
  }
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
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
    this.loadingRecords = true;
    if (this.roles?.length) {
      const roles = this.roles.join(',');
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `ROLE_ID IN (${roles})`;
      this.isRoleFIlterApplied = true;
    } else {
      this.isRoleFIlterApplied = false;
    }
    if (this.Name !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `TITLE LIKE '%${this.Name.trim()}%'`;
      this.isnameFilterApplied = true;
    }
    else {
      this.isnameFilterApplied = false;
    }
    if (this.Description !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `SNAPSHOT_LINK LIKE '%${this.Description.trim()}%'`;
      this.isDistapply = true;
    }
    else {
      this.isDistapply = false;
    }
    if (this.seqno !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `SEQ_NO LIKE '%${this.seqno.trim()}%'`;
      this.isseqapply = true;
    }
    else {
      this.isseqapply = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
    this.api
      .getDashboard(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          const responseBody = data.body;
          if (data.status == 200) {
            this.loadingRecords = false;
            this.totalRecords = responseBody["count"];
            this.dataList = responseBody["data"];
            this.TabId = responseBody["TAB_ID"];
          } else if (data.status == 400) {
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
  add(): void {
    this.drawerTitle = "Add New Dashboard";
    this.drawerData = new DashboardMaster();
    this.drawerVisible = true;
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
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: DashboardMaster): void {
    this.drawerTitle = "Update Dashboard";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  back() {
    this.router.navigate(["/masters/menu"]);
  }
  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
      this.loadFilters();
    }
  }
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  openfilter() {
    this.drawerTitle = "Dashboard Filter";
    this.filterFields[0]["options"] = this.roleData1;
    this.drawerFilterVisible = true;
    this.editButton = "N";
    this.FILTER_NAME = "";
    this.EditQueryData = [];
    this.filterGroups = [
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
  }
  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'ROLE_ID',
      label: 'Role',
      type: 'select',
      comparators: ['=', '!='],
      options: [],
      placeholder: 'Select Role',
    },
    {
      key: "TITLE",
      label: "Dashboard Title",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Title",
    },
    {
      key: "STATUS",
      label: "Status",
      type: "select",
      comparators: ["=", "!="],
      options: [
        { value: "1", display: "Active" },
        { value: "0", display: "Inactive" },
      ],
      placeholder: "Select Status",
    },
  ];
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === "string" ? `'${value}'` : value; 
        switch (comparator) {
          case "Contains":
            return `${field} LIKE '%${value}%'`;
          case "Does Not Contains":
            return `${field} NOT LIKE '%${value}%'`;
          case "Starts With":
            return `${field} LIKE '${value}%'`;
          case "Ends With":
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });
      const nestedGroups = (group.groups || []).map(processGroup);
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };
    return filterGroups.map(processGroup).join(" AND "); 
  }
  showFilter() {
    if (this.filterClass === "filter-visible")
      this.filterClass = "filter-invisible";
    else this.filterClass = "filter-visible";
  }
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = "filter-invisible";
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = " AND (" + item.FILTER_QUERY + ")";
    this.search(true);
  }
  isModalVisible = false; 
  selectedQuery: string = ""; 
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ""; 
  }
  userId = sessionStorage.getItem("userId"); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  TabId: number;
  Clearfilter() {
    this.filterClass = "filter-invisible";
    this.selectedFilter = "";
    this.isfilterapply = false;
    this.filterQuery = "";
    this.search();
  }
  drawerfilterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterloading: boolean = false;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        "",
        "",
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) 
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            this.filterQuery = "";
          } else {
            this.filterloading = false;
            this.message.error("Failed to load filters.", "");
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error("An error occurred while loading filters.", "");
        }
      );
    this.filterQuery = "";
  }
  deleteItem(item: any): void {
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success("Filter deleted successfully.", "");
          this.filterloading = false;
          this.isfilterapply = false;
          this.filterClass = "filter-invisible";
          this.loadFilters();
          this.filterQuery = "";
          this.search(true);
        } else {
          this.message.error("Failed to delete filter.", "");
          this.filterloading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
        if (err.status === 0) {
          this.message.error(
            "Unable to connect. Please check your internet or server connection and try again shortly.",
            ""
          );
        } else {
          this.message.error("Something Went Wrong.", "");
        }
      }
    );
  }
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON);
    this.FILTER_NAME = data.FILTER_NAME;
    this.EditQueryData = data;
    this.editButton = "Y";
    this.drawerTitle = "Edit Query";
    this.drawerFilterVisible = true;
  }
}
