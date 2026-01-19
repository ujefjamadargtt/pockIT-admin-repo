import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent {
  drawerChatVisible: boolean = false
  drawerChatTitle!: string;
  drawerData;
  formTitle = 'Chat Module';
  radioValue = 'A';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "NAME";
  searchText: string = "";
  dataList = [
    {
      QUESTION: 'What is Angular?',
      CATEGORY_NAME: 'Framework',
      SUBCATEGORY_NAME: 'Frontend',
      NAME: 'Angular Query',
      DESCRIPTION: 'Discussion about Angular and its features.',
      TICKET_NO: 'TCK12345',
      IS_TAKEN: 'Yes',
      TAKEN_BY: 'John Doe',
      STATUS: 'Closed',
    },
    {
      QUESTION: 'How to use RxJS?',
      CATEGORY_NAME: 'Library',
      SUBCATEGORY_NAME: 'Reactive',
      NAME: 'RxJS Basics',
      DESCRIPTION: 'Introduction to RxJS and its usage.',
      TICKET_NO: 'TCK12346',
      IS_TAKEN: 'No',
      TAKEN_BY: 'Jane Smith',
      STATUS: 'Pending',
    },
  ];
  loadingRecords = false;
  totalRecords = 1;
  columns: string[][] = [
    ["NAME", "NAME"],
    ["DESCRIPTION", "DESCRIPTION"],
    ["SUBCATEGORY_NAME", "SUBCATEGORY_NAME"],
    ["CATEGORY_NAME", "CATEGORY_NAME"],
  ];
  showcloumnVisible: boolean = false;
  servicecattext: string = "";
  sercatnameVisible: boolean = false;
  servicecatdesctext: string = "";
  sercatdescVisible: boolean = false;
  selectedCategories: number[] = [];
  categoryVisible = false;
  selectedSubCategories: number[] = [];
  subcategoryVisible = false;
  statusFilter: string | undefined = undefined;
  showcolumn = [
    { label: 'Category', key: 'CATEGORY_ID', visible: true },
    { label: 'Subcategory', key: 'SUBCATEGORY_ID', visible: true },
    { label: 'Service Name', key: 'NAME', visible: true },
    { label: 'Service Description', key: 'DESCRIPTION', visible: true },
    { label: 'Status', key: 'STATUS', visible: true }
  ];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.getcategoryData();
    this.getsubcategoryData();
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  filterClass: string = "filter-invisible";
  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
    }
  }
  keyup() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else if (this.searchText.length === 0) {
      this.search(true);
    } else if (this.searchText.length < 3) {
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
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach((column) => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    var globalSearchQuery = "";
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
    if (this.servicecattext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `NAME LIKE '%${this.servicecattext.trim()}%'`;
    }
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; 
    }
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUBCATEGORY_ID IN (${this.selectedSubCategories.join(',')})`; 
    }
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `AVAILABILITY_STATUS= ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : "");
  }
  sort(params: NzTableQueryParams) {
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
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
  }
  onCategoryChange(): void {
    this.search();
  }
  onSubCategoryChange(): void {
    this.search();
  }
  reset(): void {
    this.searchText = "";
    this.servicecattext = "";
    this.servicecatdesctext = "";
    this.search();
  }
  listOfFilter: any[] = [
    { text: "Active", value: "1" },
    { text: "Inactive", value: "0" },
  ];
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  CategoryData: any = [];
  getcategoryData() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', " AND STATUS=1").subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.CategoryData = data["data"];
        } else {
          this.CategoryData = [];
          this.message.error("Failed To Get Category Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }
  SubCategoryData: any = [];
  getsubcategoryData() {
    this.api.getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data["code"] == 200) {
          this.SubCategoryData = data["data"];
        } else {
          this.SubCategoryData = [];
          this.message.error("Failed To Get Subategory Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
      }
    );
  }
  view(data: any) {
    this.drawerChatTitle = ` ${data.TICKET_NO} `;
    this.drawerData = Object.assign({}, data);
    this.drawerChatVisible = true;
  }
  drawerChatClose(): void {
    this.search();
    this.drawerChatVisible = false;
  }
  get closeCallback() {
    return this.drawerChatClose.bind(this);
  }
  isfilterapply: boolean = false;
  filterQuery: string = "";
  visible = false;
  hide: boolean = true;
  filterQuery1: any = "";
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    "=",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
    "Contains",
    "Does not Contain",
    "Start With",
    "End With",
  ];
  getComparisonOptions(selectedColumn: string): string[] {
    if (selectedColumn === 'CATEGORY_ID' || selectedColumn === 'SUBCATEGORY_ID' ||
      selectedColumn === 'AVAILABILITY_STATUS') {
      return ['=', '!='];
    }
    return [
      '=',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      'Contains',
      'Does not Contain',
      'Start With',
      'End With',
    ];
  }
  columns2: string[][] = [["AND"], ["OR"]];
  columns1: { label: string; value: string }[] = [
    { label: 'Support Agent', value: 'SUPPORT_AGENT' },
    { label: 'Category', value: 'CATEGORY_ID' },
  ];
  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter;
  }
  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;
  conditions: any[] = [];
  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: "",
      COMPARISION_VALUE: "",
      TABLE_VALUE: "",
    });
  }
  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }
  operators: string[] = ["AND", "OR"];
  showQueriesArray = [];
  filterBox = [
    {
      CONDITION: "",
      FILTER: [
        {
          CONDITION: "",
          SELECTION1: "",
          SELECTION2: "",
          SELECTION3: "",
        },
      ],
    },
  ];
  addCondition() {
    this.filterBox.push({
      CONDITION: "",
      FILTER: [
        {
          CONDITION: "",
          SELECTION1: "",
          SELECTION2: "",
          SELECTION3: "",
        },
      ],
    });
  }
  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }
  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]["FILTER"].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION1"
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION2"
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION3"
      ];
    if (!selection1) {
      this.message.error("Please select a column", "");
    } else if (!selection2) {
      this.message.error("Please select a comparison", "");
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        "Please enter a valid value with at least 1 characters",
        ""
      );
    } else {
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: "",
        SELECTION1: "",
        SELECTION2: "",
        SELECTION3: "",
      });
    }
  }
  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }
  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]["FILTER"].length - 1;
    if (
      this.filterBox[i]["FILTER"][j]["SELECTION1"] == undefined ||
      this.filterBox[i]["FILTER"][j]["SELECTION1"] == "" ||
      this.filterBox[i]["FILTER"][j]["SELECTION2"] == undefined ||
      this.filterBox[i]["FILTER"][j]["SELECTION2"] == "" ||
      this.filterBox[i]["FILTER"][j]["SELECTION3"] == undefined ||
      this.filterBox[i]["FILTER"][j]["SELECTION3"] == "" ||
      this.filterBox[i]["FILTER"][j]["CONDITION"] == undefined ||
      this.filterBox[i]["FILTER"][j]["CONDITION"] == null
    ) {
      isOk = false;
      this.message.error("Please check some fields are empty", "");
    } else if (
      i != 0 &&
      (this.filterBox[i]["CONDITION"] == undefined ||
        this.filterBox[i]["CONDITION"] == null ||
        this.filterBox[i]["CONDITION"] == "")
    ) {
      isOk = false;
      this.message.error("Please select operator.", "");
    }
    if (isOk) {
      this.filterBox.push({
        CONDITION: "",
        FILTER: [
          {
            CONDITION: "",
            SELECTION1: "",
            SELECTION2: "",
            SELECTION3: "",
          },
        ],
      });
    }
  }
  query = "";
  query2 = "";
  showquery: any;
  isSpinner: boolean = false;
  createFilterQuery(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]["FILTER"].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION1"
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION2"
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION3"
      ];
    const selection4 = this.filterBox[lastFilterIndex]["CONDITION"];
    if (!selection1) {
      this.message.error("Please select a column", "");
    } else if (!selection2) {
      this.message.error("Please select a comparison", "");
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        "Please enter a valid value with at least 1 characters",
        ""
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error("Please Select the Operator", "");
    } else {
      this.isSpinner = true;
      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ") " + this.filterBox[i]["CONDITION"] + " (";
        } else this.query = "(";
        this.query2 = "";
        for (let j = 0; j < this.filterBox[i]["FILTER"].length; j++) {
          const filter = this.filterBox[i]["FILTER"][j];
          if (j == 0) {
          } else {
            if (filter["CONDITION"] == "AND") {
              this.query2 = this.query2 + " AND ";
            } else {
              this.query2 = this.query2 + " OR ";
            }
          }
          let selection1 = filter["SELECTION1"];
          let selection2 = filter["SELECTION2"];
          let selection3 = filter["SELECTION3"];
          if (selection2 == "Contains") {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == "End With") {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == "Start With") {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]["FILTER"].length) {
            this.query += this.query2;
          }
        }
        if (i + 1 == this.filterBox.length) {
          this.query += ")";
        }
      }
      this.showquery = this.query;
      var newQuery = " AND " + this.query;
      this.filterQuery1 = newQuery;
      let sort = ""; 
      let filterQuery = "";
      this.QUERY_NAME = "";
    }
  }
  restrictedKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER", "CREATE", "RENAME", "GRANT", "REVOKE", "EXECUTE", "UNION", "HAVING", "WHERE", "ORDER BY", "GROUP BY", "ROLLBACK", "COMMIT", "--", ";", ""
  ];
  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }
  applyFilter(i, j) {
    const inputValue = this.filterBox[i].FILTER[j].SELECTION3;
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]["FILTER"].length - 1;
    const selection1 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION1"
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION2"
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]["FILTER"][lastSubFilterIndex][
      "SELECTION3"
      ];
    if (!selection1) {
      this.message.error("Please select a column", "");
    } else if (!selection2) {
      this.message.error("Please select a comparison", "");
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        "Please enter a valid value with at least 1 characters",
        ""
      );
    } else if (typeof inputValue === 'string' && !this.isValidInput(inputValue)) {
      this.message.error(
        `Invalid Input: ${inputValue} is not allowed.`, ''
      );
    }
    else {
      let sort: string;
      let filterQuery = "";
      try {
        sort = this.sortValue.startsWith("a") ? "asc" : "desc";
      } catch (error) {
        sort = "";
      }
      this.isSpinner = true;
      const getComparisonFilter = (
        comparisonValue: any,
        columnName: any,
        tableValue: any
      ) => {
        switch (comparisonValue) {
          case "=":
          case "!=":
          case "<":
          case ">":
          case "<=":
          case ">=":
            return `${tableValue} ${comparisonValue} '${columnName}'`;
          case "Contains":
            return `${tableValue} LIKE '%${columnName}%'`;
          case "Does not Contain":
            return `${tableValue} NOT LIKE '%${columnName}%'`;
          case "Start With":
            return `${tableValue} LIKE '${columnName}%'`;
          case "End With":
            return `${tableValue} LIKE '%${columnName}'`;
          default:
            return "";
        }
      };
      const FILDATA = this.filterBox[i]["FILTER"]
        .map((item) => {
          const filterCondition = getComparisonFilter(
            item.SELECTION2,
            item.SELECTION3,
            item.SELECTION1
          );
          return `AND (${filterCondition})`;
        })
        .join(" ");
      this.api
        .getServiceCatData(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          FILDATA
        )
        .subscribe(
          (data) => {
            if (data["code"] === 200) {
              this.totalRecords = data["count"];
              this.dataList = data["data"];
              this.isSpinner = false;
              this.filterQuery = "";
            } else {
              this.dataList = [];
              this.isSpinner = false;
            }
          },
          (err) => {
            if (err["ok"] === false) this.message.error("Server Not Found", "");
          }
        );
    }
  }
  resetValues(): void {
    this.filterBox = [
      {
        CONDITION: "",
        FILTER: [
          {
            CONDITION: "",
            SELECTION1: "",
            SELECTION2: "",
            SELECTION3: "",
          },
        ],
      },
    ];
    this.search();
  }
  public visiblesave = false;
  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }
  QUERY_NAME: string = '';
  name1: any
  name2: any
  INSERT_NAMES: any[] = [];
  isModalVisible = false; 
  selectedQuery: string = ''; 
  toggleLiveDemo(query: string, name: string): void {
    this.selectedQuery = query;
    this.isModalVisible = true; 
  }
  deleteItem(item: any) {
    this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  }
  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }
  handleOkTop(): void {
    const lastFilterIndex = this.filterBox.length - 1; 1
    const lastSubFilterIndex = this.filterBox[lastFilterIndex]['FILTER'].length - 1;
    const selection1 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION1'];
    const selection2 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION2'];
    const selection3 = this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex]['SELECTION3'];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];
    if (!selection1) {
      this.message.error("Please select a column", '');
    } else if (!selection2) {
      this.message.error("Please select a comparison", '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error("Please enter a valid value with at least 1 characters", '');
    }
    else if (!selection4 && lastFilterIndex > 0) {
      this.message.error("Please Select the Operator", '');
    }
    else {
      this.isSpinner = true;
      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';
        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }
          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];
          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            this.query += this.query2;
          }
        }
        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }
      this.showquery = this.query;
    }
    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '')
    }
    else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      this.visiblesave = false;
      this.QUERY_NAME = ''; 
    }
    this.visiblesave = false;
  }
  handleCancelTop(): void {
    this.visiblesave = false;
  }
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
}
