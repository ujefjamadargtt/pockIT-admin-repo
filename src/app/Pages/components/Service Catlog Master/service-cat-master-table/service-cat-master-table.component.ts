import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { ServiceCatMasterData } from "src/app/Pages/Models/ServiceCatMasterData";
import { ApiServiceService } from "src/app/Service/api-service.service";

@Component({
  selector: "app-service-cat-master-table",
  templateUrl: "./service-cat-master-table.component.html",
  styleUrls: ["./service-cat-master-table.component.css"],
})
export class ServiceCatMasterTableComponent {
  drawerVisible: boolean = false;
  drawerData: ServiceCatMasterData = new ServiceCatMasterData();
  searchText: string = "";
  formTitle = "Manage Service Catalogue";
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "NAME";
  chapters: any = [];
  isLoading = true;

  //Mapping
  drawerMappigVisible: boolean = false
  drawerMappingTitle!: string;

  draweMappingClose(): void {
    this.search();
    this.drawerMappigVisible = false;
  }

  mapSkill(data: any) {
    this.drawerMappingTitle = `Map Skills to ${data.NAME} Service Catlogue`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisible = true;
  }

  get closeCallbackMapping() {
    return this.draweMappingClose.bind(this);
  }

  columns: string[][] = [
    ["CATEGORY_NAME", "CATEGORY_NAME"],
    ["SUBCATEGORY_NAME", "SUBCATEGORY_NAME"],
    ["NAME", "Name"],
    ["DESCRIPTION", "DESCRIPTION"],
    ["REGULAR_PRICE_B2C", "REGULAR_PRICE_B2C"],
    ["REGULAR_PRICE_B2B", "REGULAR_PRICE_B2B"],
    ["EXPRESS_PRICE_B2C", "EXPRESS_PRICE_B2C"],
    ["EXPRESS_PRICE_B2B", "EXPRESS_PRICE_B2B"],
    ["DURATION", "DURATION"]
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
  showcloumnVisible: boolean = false;
  servicecattext: string = "";
  sercatnameVisible: boolean = false;

  servicecatdesctext: string = "";
  sercatdescVisible: boolean = false;

  B2Btext: string = "";
  b2bVisible: boolean = false;

  B2Ctext: string = "";
  b2cVisible: boolean = false;

  expresspriceb2b: string = "";
  expressb2bVisible: boolean = false;

  expresspriceb2c: string = "";
  expressb2cVisible: boolean = false;

  estimationTimemins: string = "";
  estimationTimeVisible: boolean = false;



  selectedCategories: number[] = [];
  categoryVisible = false;

  selectedSubCategories: number[] = [];
  subcategoryVisible = false;

  showcolumn = [
    { label: 'Category', key: 'CATEGORY_ID', visible: true },
    { label: 'Subcategory', key: 'SUBCATEGORY_ID', visible: true },
    { label: 'Service Name', key: 'NAME', visible: true },
    { label: 'Service Description', key: 'DESCRIPTION', visible: true },
    { label: 'Price B2B', key: 'REGULAR_PRICE_B2B', visible: true },
    { label: 'Price B2C', key: 'REGULAR_PRICE_B2C', visible: true },
    { label: 'Express Price For B2B', key: 'EXPRESS_PRICE_B2B', visible: true },
    { label: 'Express Price For B2C', key: 'EXPRESS_PRICE_B2C', visible: true },
    { label: 'Estimation Time', key: 'DURATION', visible: true },
    { label: 'Catlogue Image', key: 'SERVICE_IMAGE_URL', visible: true },

    // { label: 'Image Url', key: 'ITEM_IMAGE_URL', visible: false },

    { label: 'Status', key: 'AVAILABILITY_STATUS', visible: true }
  ];

  widthsSkill: string = '100%';

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onCategoryChange(): void {
    this.search();
  }
  onSubCategoryChange(): void {
    this.search();
  }
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find(col => col.key === key);
    return column ? column.visible : true;
  }
  keyup() {
    if (this.searchText.length >= 3) {
      this.search(true);
    }
    else if (this.searchText.length === 0) {
      this.dataList = []
      this.search(true)
    }
  }
  ngOnInit() {
    this.getcategoryData();
    this.getsubcategoryData();
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
    // if (this.searchText != "") {
    //   likeQuery = " AND";
    //   this.columns.forEach((column) => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    // }
    this.loadingRecords = true;

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
    if (this.servicecattext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `NAME LIKE '%${this.servicecattext.trim()}%'`;
    }
    // category Filter
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; // Update with actual field name in the DB
    }

    // subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUBCATEGORY_ID IN (${this.selectedSubCategories.join(',')})`; // Update with actual field name in the DB
    }
    if (this.servicecatdesctext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `DESCRIPTION LIKE '%${this.servicecatdesctext.trim()}%'`;
    }

    if (this.B2Btext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `REGULAR_PRICE_B2B LIKE '%${this.B2Btext.trim()}%'`;
    }

    if (this.B2Ctext !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `REGULAR_PRICE_B2C LIKE '%${this.B2Ctext.trim()}%'`;
    }

    if (this.expresspriceb2b !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `EXPRESS_PRICE_B2B LIKE '%${this.expresspriceb2b.trim()}%'`;
    }
    if (this.expresspriceb2c !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `EXPRESS_PRICE_B2C LIKE '%${this.expresspriceb2c.trim()}%'`;
    }
    if (this.estimationTimemins !== "") {
      likeQuery +=
        (likeQuery ? " AND " : "") +
        `DURATION LIKE '%${this.estimationTimemins.trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== "") {
        likeQuery += " AND ";
      }
      likeQuery += `AVAILABILITY_STATUS= ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? " AND " + likeQuery : '');

    this.api
      .getServiceCatData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data["code"] == 200) {
            this.loadingRecords = false;
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
    this.drawerTitle = "Create New Service Catalogue ";
    this.drawerData = new ServiceCatMasterData();
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }



  edit(data: ServiceCatMasterData): void {
    this.drawerTitle = "Update Service Catalogue ";
    this.drawerData = Object.assign({}, data);


    this.drawerVisible = true;
    // this.drawerData.DURATION = "";

  }

  reset(): void {
    this.searchText = "";
    this.servicecattext = "";
    this.servicecatdesctext = "";
    this.expresspriceb2b = "";
    this.expresspriceb2c = "";
    this.search();
  }

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }

  // Main Filter code
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
    { label: 'Category', value: 'CATEGORY_ID' },
    { label: 'Subcategory', value: 'SUBCATEGORY_ID' },
    { label: "Service Name", value: "NAME" },
    { label: "Service Description", value: "DESCRIPTION" },
    { label: 'Price B2B (₹)', value: 'REGULAR_PRICE_B2B' },
    { label: 'Price B2C (₹)', value: 'REGULAR_PRICE_B2C' },
    { label: 'Express Price For B2B (₹)', value: 'EXPRESS_PRICE_B2B' },
    { label: 'Express Price For B2C (₹)', value: 'EXPRESS_PRICE_B2C' },
    { label: 'Estimation Time (mins)', value: 'DURATION' },
    { label: 'Status', value: 'AVAILABILITY_STATUS' }

  ];

  filterClass: string = "filter-invisible";
  showMainFilter() {
    if (this.filterClass === "filter-visible") {
      this.filterClass = "filter-invisible";
    } else {
      this.filterClass = "filter-visible";
    }
  }

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
  // QUERY_NAME: string = '';
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

  /*******  Create filter query***********/
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
            //this.query2 += '(';
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
            //this.query2 += ') ';
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



      let sort = ""; // Assign a default value to sort
      let filterQuery = "";
      this.api
        .getServiceCatData(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
          // filterQuery
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

      this.QUERY_NAME = "";
    }
  }

  restrictedKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER", "CREATE", "RENAME", "GRANT", "REVOKE", "EXECUTE", "UNION", "HAVING", "WHERE", "ORDER BY", "GROUP BY", "ROLLBACK", "COMMIT", "--", ";", "/*", "*/"
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
      // Show error message
      this.message.error(
        `Invalid Input: ${inputValue} is not allowed.`, ''
      );
    }
    else {



      // var DemoData:any = this.filterBox
      let sort: string;
      let filterQuery = "";

      try {
        sort = this.sortValue.startsWith("a") ? "asc" : "desc";
      } catch (error) {
        sort = "";
      }
      // Define a function to get the comparison value filter

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
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  // Insertname() {
  //   if (this.QUERY_NAME.trim()) {
  //     this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });

  //      
  //     this.visiblesave = false;
  //     this.QUERY_NAME = ""; // Clear input after adding
  //   } else {
  //      
  //   }
  // }

  toggleLiveDemo(query: string, name: string): void {

    this.selectedQuery = query;

    // Assign the query to display
    this.isModalVisible = true; // Show the modal
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

  ViewImage: any;
  ImageModalVisible = false;
  imageshow;

  viewImage(imageURL: string): void {


    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = "";
  GetImage(link: string) {

    let imagePath = this.api.retriveimgUrl + "ServiceCatalog/" + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;


    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  ImageModalCancel() {
    this.ImageModalVisible = false;
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
            //this.query2 += '(';
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
            //this.query2 += ') ';
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
      this.QUERY_NAME = ''; // Clear input after adding
    }
    this.visiblesave = false;
  }


  handleCancelTop(): void {
    this.visiblesave = false;
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }
}
