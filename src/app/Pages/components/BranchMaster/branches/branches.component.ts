import { Component, OnInit, ViewChild } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Branchmaster } from "src/app/Pages/Models/branchmaster";
import { ApiServiceService } from "src/app/Service/api-service.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonFunctionService } from "src/app/Service/CommonFunctionService";
@Component({
  selector: "app-branches",
  templateUrl: "./branches.component.html",
  styleUrls: ["./branches.component.css"],
})
export class BranchesComponent implements OnInit {
  formTitle = "Manage Branches";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  countryvisible: boolean = false;
  PINCODEVisible: boolean = false;
  branchvisible: boolean = false;
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [
    ["NAME", "Branch Name"],
    ["COUNTRY_NAME", "Country"],
    ["STATE_NAME", "State"],
  ];
  time = new Date();
  drawerVisible: boolean;
  drawerTitle: string;
  drawerTitle1: string;
  drawerData: Branchmaster = new Branchmaster();
  countrytext: string = "";
  statetext: string = "";
  citytext: string = "";
  pincodetext: string = "";
  branchtext: string = "";
  selectedCountries: number[] = [];
  selectedStates: number[] = [];
  selectedCities: number[] = [];
  selectedDistrict: number[] = [];
  selectedPincode: number[] = [];
  isBranchNameFilterApplied = false;
  isCountryNameFilterApplied = false;
  isStateNameFilterApplied = false;
  isCityNameFilterApplied = false;
  isDistrictNameFilterApplied = false;
  isPincodeFilterApplied = false;
  iscountrynameFilterApplied: boolean = false;
  countryVisible: boolean = false;
  isStatenameFilterApplied: boolean = false;
  stateVisible: boolean = false;
  isCitynameFilterApplied: boolean = false;
  CityVISIBLE: boolean = false;
  isDistrictnameFilterApplied: boolean = false;
  districtVisible: boolean = false;
  isPincodenameFilterApplied: boolean = false;
  pincodeVisible: boolean = false;
  columns1: { label: string; value: string }[] = [
    { label: "Branch ", value: "NAME" },
    { label: "Country", value: "COUNTRY_ID" },
    { label: "State", value: "STATE_NAME" },
  ];
  showcolumn = [
    { label: "Branch ", key: "NAME", visible: true },
    { label: "Country", key: "COUNTRY_NAME", visible: true },
    { label: "State", key: "STATE_NAME", visible: true },
  ];
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
    private cookie: CookieService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.search();
    this.getCountyData();
    this.getStateData();
    this.getCityData();
    this.getDistrictData();
    this.getPincodeData("PINCODE");
  }
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  onCountryChange(): void {
    if (this.selectedCountries?.length) {
      this.search();
      this.iscountrynameFilterApplied = true; 
    } else {
      this.search();
      this.iscountrynameFilterApplied = false; 
    }
  }
  onStateChange(): void {
    if (this.selectedStates?.length) {
      this.search();
      this.isStateNameFilterApplied = true; 
    } else {
      this.search();
      this.isStateNameFilterApplied = false; 
    }
  }
  onDistrictChange(): void {
    if (this.selectedDistrict?.length) {
      this.search();
      this.isDistrictNameFilterApplied = true; 
    } else {
      this.search();
      this.isDistrictNameFilterApplied = false; 
    }
  }
  onCityChange(): void {
    if (this.selectedCities?.length) {
      this.search();
      this.isCityNameFilterApplied = true; 
    } else {
      this.search();
      this.isCityNameFilterApplied = false; 
    }
  }
  onPincodeChange(): void {
    if (this.selectedPincode?.length) {
      this.search();
      this.isPincodeFilterApplied = true; 
    } else {
      this.search();
      this.isPincodeFilterApplied = false; 
    }
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
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  nameFilter() {
    if (this.branchtext.trim() === "") {
      this.searchText = "";
    } else if (this.branchtext.length >= 3) {
      this.search();
    } else {
    }
  }
  likeQuery1 = "";
  filteredBranchData: any[] = [];
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
    this.loadingRecords = true;
    let sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }
    let likeQuery = "";
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
    if (this.branchtext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") + `NAME LIKE '%${this.branchtext.trim()}%'`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`; 
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `STATE_NAME IN ('${this.selectedStates.join("','")}')`; 
    }
    if (this.selectedDistrict.length > 0) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `DISTRICT_NAME IN ('${this.selectedDistrict.join("','")}')`; 
    }
    if (this.selectedCities.length > 0) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `CITY_NAME IN ('${this.selectedCities.join("','")}')`; 
    }
    if (this.selectedPincode.length > 0) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `PINCODE IN ('${this.selectedPincode.join("','")}')`; 
    }
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
    const finalDataList =
      this.filteredBranchData.length > 0
        ? this.filteredBranchData
        : this.dataList;
    this.api
      .getAllBranch(
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
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = "Add New Branch";
    this.drawerData = new Branchmaster();
    this.drawerData.IS_ACTIVE = true;
    this.api.getAllBranch(1, 1, "SEQ_NO", "desc", "" + "").subscribe(
      (data) => {
        if (data["count"] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
        }
      },
      (err) => { }
    );
    this.drawerVisible = true;
  }
  STATE_HAS_LWF = false;
  edit(data: Branchmaster): void {
    this.drawerTitle = "Update Branch Details";
    this.drawerData = Object.assign({}, data);
    this.STATE_HAS_LWF = false;
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  keyup(keys) {
    const element = window.document.getElementById("button");
    if (this.searchText.length >= 3 && keys.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
  }
  onKeyup(event: KeyboardEvent): void {
    const element = window.document.getElementById("button");
    if (this.searchText.length >= 3 && event.key === "Enter") {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key == "Backspace") {
      this.dataList = [];
      this.search(true);
    }
    if (this.branchtext.length >= 3 && event.key === "Enter") {
      this.search();
      this.isBranchNameFilterApplied = true;
    } else if (this.branchtext.length == 0 && event.key === "Backspace") {
      this.search();
      this.isBranchNameFilterApplied = false;
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  visible: boolean = false;
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, "NAME", "asc", " AND IS_ACTIVE = 1")
      .subscribe((data) => {
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.countryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  stateData: any = [];
  getStateData() {
    this.api
      .getState(0, 0, "NAME", "asc", " AND IS_ACTIVE = 1")
      .subscribe((data) => {
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.stateData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  cityData: any = [];
  getCityData() {
    this.api
      .getAllCityMaster(0, 0, "NAME", "asc", " AND IS_ACTIVE = 1")
      .subscribe((data) => {
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.cityData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  districtData: any = [];
  getDistrictData() {
    this.api
      .getDistrictData(0, 0, "NAME", "asc", " AND IS_ACTIVE = 1")
      .subscribe((data) => {
        if (data["code"] == "200") {
          if (data["count"] > 0) {
            data["data"].forEach((element) => {
              this.districtData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  pincodeData: any = [];
  getPincodeData(columnKey) {
    this.api.getDistinctData(4, columnKey).subscribe((data) => {
      if (data["code"] == "200") {
        if (data["count"] > 0) {
          data["data"].forEach((element) => {
            this.pincodeData.push({
              value: element.PINCODE,
              display: element.PINCODE,
            });
          });
        }
      }
    });
  }
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  reset() { }
  back() {
    this.router.navigate(["/masters/menu"]);
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(4, columnKey).subscribe(
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
  openfilter() {
    this.drawerTitle = "Branch Filter";
    this.filterFields[1]["options"] = this.countryData;
    this.filterFields[2]["options"] = this.stateData;
    this.filterFields[3]["options"] = this.districtData;
    this.filterFields[4]["options"] = this.pincodeData;
    this.drawerFilterVisible = true;
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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
      ) 
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
      label: "Branch Name",
      type: "text",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: "Enter Branch Name",
    },
    {
      key: "COUNTRY_NAME",
      label: "Country",
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: "Select Country",
    },
    {
      key: "STATE_NAME",
      label: "State",
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: "Select State",
    },
    {
      key: "DISTRICT_NAME",
      label: "District",
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: "Select District",
    },
    {
      key: "PINCODE",
      label: "Pincode",
      type: "search",
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: "Select Pincode",
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
  isDeleting: boolean = false;
  selectedFilter: string | null = null;
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
  filterloading: boolean = false;
  filterData: any;
  currentClientId = 1; 
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterFields[1]["options"] = this.countryData;
    this.filterFields[2]["options"] = this.stateData;
    this.filterFields[3]["options"] = this.districtData;
    this.filterFields[4]["options"] = this.pincodeData;
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