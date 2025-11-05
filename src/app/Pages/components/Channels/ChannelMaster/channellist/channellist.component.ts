import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
import { ChannelMaster } from "../../ChannelMaster";
@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.css']
})
export class ChannellistComponent implements OnInit {

  drawerVisible: boolean = false;
  drawerData: ChannelMaster = new ChannelMaster();
  searchText: string = "";
  formTitle = "Manage Channels";
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "CHANNEL_NAME";
  chapters: any = [];
  isLoading = true;
  hide: boolean = true;
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

  back() {
    this.router.navigate(["/masters/menu"]);
  }

  channeltext: string = "";
  channeldesctext: string = "";

  channelVisible: boolean = false;
  channeldescVisible: boolean = false;

  operators: string[] = ["AND", "OR"];
  query = "";
  query2 = "";
  showquery: any;
  isSpinner: boolean = false;

  public visiblesave = false;
  filterQuery1: any = "";
  QUERY_NAME: string = "";
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];

  isChannelNameFilterApplied = false;
  isDescFilterApplied = false;

  columns1: { label: string; value: string }[] = [
    { label: "Channel Name", value: "CHANNEL_NAME" },
    { label: "Description", value: "DESCRIPTION" },
    { label: "Status", value: "STATUS" },
  ];

  columns: string[][] = [
    ["CHANNEL_NAME", "CHANNEL_NAME"],
    ["DESCRIPTION", "DESCRIPTION"],
    ["STATUS", "STATUS"],
  ];
  loadingRecords = false;
  totalRecords = 1;
  dataList: any = [];
  drawerTitle!: string;

  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  useridd: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.useridd = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.getUser()
    this.loadRoles()
  }
  // keyup() {
  //   if (this.searchText.length >= 3) {
  //     this.search();
  //   }
  //   else if (this.searchText.length === 0) {
  //     this.dataList = []
  //     this.search()
  //   }
  // }
  userData: any = [];
  getUser() {
    this.api.getAllUsers(0, 0, '', '', ' AND ID=' + this.useridd).subscribe(
      (data) => {
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.userData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        } else {
          this.message.error('Failed To Get user Data...', '');

        }
      },
      () => {
        this.message.error('Something went wrong.', '');
      }
    );
  }
  roles: any = [];
  loadRoles() {

    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (data) => {
        // this.roles = roles['data'];
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.roles.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      },
      () => {
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {


    this.api.getDistinctData(this.TabId, columnKey).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.distinctData = data["data"];
        } else {
          this.distinctData = [];
          this.message.error("Failed To Get Distinct data Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === "Backspace") {
      this.search(true);
    }

    if (this.channeltext.length >= 3 && event.key === "Enter") {
      this.search();
    } else if (this.channeltext.length == 0 && event.key === "Backspace") {
      this.search();
    }

    if (this.channeldesctext.length >= 3 && event.key === "Enter") {
      this.search();
    } else if (this.channeldesctext.length == 0 && event.key === "Backspace") {
      this.search();
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

    // if (this.searchText != '') {
    //   likeQuery = ' AND';
    //   this.columns.forEach((column) => {
    //     likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    // }

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
    if (this.channeltext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `CHANNEL_NAME LIKE '%${this.channeltext.trim()}%'`;
      this.isChannelNameFilterApplied = true;
    } else {
      this.isChannelNameFilterApplied = false;
    }

    if (this.channeldesctext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `DESCRIPTION LIKE '%${this.channeldesctext.trim()}%'`;
      this.isDescFilterApplied = true;
    } else {
      this.isDescFilterApplied = false;
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
      .getChannelData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe((data: HttpResponse<any>) => {
        if (data["status"] == 200) {
          this.loadingRecords = false;
          this.TabId = data.body['TAB_ID'];
          this.totalRecords = data.body['count'];
          this.dataList = data.body['data'];
        } else if (data['status'] == 400) {
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

  add(): void {
    this.drawerTitle = "Add New Channel ";
    this.drawerData = new ChannelMaster();
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  edit(data: ChannelMaster): void {
    this.drawerTitle = "Update Channel";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  showcolumn = [
    { label: "Channel", key: "CHANNEL_NAME", visible: true },
    { label: "Status", key: "STATUS", visible: true },
  ];

  reset(): void {
    this.searchText = "";
    this.channeltext = "";
    this.channeldesctext = "";
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
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

  loadFilters() {
    this.api
      .getFilterData1(
        0,
        0,
        "",
        "",
        ` AND TAB_ID = '${this.TabId.toString()}' AND USER_ID = ${this.USER_ID}`
      ) // Ensure TAB_ID is treated as a string
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = "";
          } else {
            this.message.error("Failed to load filters.", "");
          }
        },
        (error) => {
          this.message.error("An error occurred while loading filters.", "");
        }
      );

    this.filterQuery = "";
  }

  Clearfilter() {
    this.filterClass = "filter-invisible";
    this.selectedFilter = "";
    this.isfilterapply = false;
    this.filterQuery = "";
    this.search();
  }

  openfilter() {
    this.drawerTitle = "Channel Filter";
    this.drawerFilterVisible = true;
    this.filterFields[0]["options"] = this.userData;
    this.filterFields[1]["options"] = this.roles;

    // Edit code 2

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
    this.loadFilters();
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    // {
    //   key: "USER_ID",
    //   label: "User",
    //   type: "select",
    //   comparators: ["=", "!="],
    //   options: [],
    //   placeholder: "Select User",
    // },
    // {
    //   key: "ROLE_ID",
    //   label: "Role",
    //   type: "select",
    //   comparators: ["=", "!="],
    //   options: [],
    //   placeholder: "Select Role",
    // },
    {
      key: "CHANNEL_NAME",
      label: "Channel Name",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Channel Name",
    },

    {
      key: "DESCRIPTION",
      label: "Description",
      type: "text",
      comparators: [
        "=",
        "!=",
        "Contains",
        "Does Not Contains",
        "Starts With",
        "Ends With",
      ],
      placeholder: "Enter Description",
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

  isDeleting: boolean = false;

  deleteItem(item: any): void {

    this.isDeleting = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success("Filter deleted successfully.", "");
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = "filter-invisible";

          this.loadFilters();
          this.filterQuery = "";
          this.search(true);
        } else {
          this.message.error("Failed to delete filter.", "");
          this.isDeleting = false;
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

  selectedFilter: string | null = null;
  // filterQuery = '';
  applyfilter(item) {
    this.filterClass = "filter-invisible";
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = " AND (" + item.FILTER_QUERY + ")";
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
    this.filterGroups = JSON.parse(data.FILTER_JSON);
    this.FILTER_NAME = data.FILTER_NAME;

    this.EditQueryData = data;
    this.editButton = "Y";
    this.drawerTitle = "Edit Query";
    this.drawerFilterVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = "";
  }
}