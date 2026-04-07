import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { StaticInventoryData } from 'src/app/Inventorypages/inventorymodal/StaticInventory';
@Component({
  selector: 'app-static-inventory',
  templateUrl: './static-inventory.component.html',
  styleUrls: ['./static-inventory.component.css'],
})
export class StaticInventoryComponent implements OnInit {
  @Input() data: StaticInventoryData
  formTitle = 'Manage Static Inventory';
  searchText: string = '';
  filterClass: string = 'filter-invisible';
  isfilterapply: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;
  loadingRecords = false;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  itemNameVisible = false;
  categoryNameVisible = false;
  brandNameVisible = false;
  descriptionVisible = false;
  quantityVisible = false;
  itemNameText = '';
  descriptionText = '';
  quantityText = '';
  isItemNameFilterApplied = false;
  isCatNameFilterApplied = false;
  isBrandNameFilterApplied = false;
  isDescriptionFilterApplied = false;
  isQuantityFilterApplied = false;
  taxData: any = [];
  statusFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  savedFilters: any[] = [];
  filterloading = false;
  selectedFilter: any = null;
  isModalVisible = false;
  selectedQuery = '';
  dataList: StaticInventoryData[] = [];
  private nextId = 9;
  originalDataMap = new Map<number, StaticInventoryData>();
  columns: string[][] = [
    ['ITEM_NAME', 'ITEM_NAME'],
    ['BRAND_NAME', 'BRAND_NAME'],
    ['INVENTORY_CATEGORY_NAME', 'INVENTORY_CATEGORY_NAME'],
  ];
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer) {
  }
  HSNdata: any = [];
  categoryData: any = [];
  brandData: any = [];
  ngOnInit(): void {
    this.search();
    this.getInventoryHSN();
  }
  onTaxChangeold(selectedId: any): void {
    if (selectedId != null && selectedId != undefined && selectedId != '') {
      var selectedProduct = this.taxData.find(
        (product) => product.ID === selectedId
      );
      if (
        selectedProduct != null &&
        selectedProduct != undefined &&
        selectedProduct != ''
      ) {
        this.data.TAX_NAME = selectedProduct['NAME'];
      } else {
        this.data.TAX_NAME = null;
      }
      this.data.TAX_ID = selectedId;
    } else {
      this.data.TAX_NAME = null;
      this.data.SELLING_PRICE = this.data.BASE_PRICE;
      this.data.TAX_ID = null;
    }
  }
  getInventoryHSN() {
    this.api.getAllHSNSAC(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe((data) => {
      if (data.code == 200) { this.HSNdata = data['data']; }
      else { this.HSNdata = []; }
    });

    this.api.getTaxData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1').subscribe((data) => {
      if (data.code == 200) { this.taxData = data['data']; }
      else { this.taxData = []; }
    });


    this.api.getInventoryCategory(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1').subscribe((data) => {
      if (data.code == 200) { this.categoryData = data['data']; }
      else { this.categoryData = []; }
    });


    this.api.getAllInventoryBrand(0, 0, 'ID', 'desc', ' AND STATUS = 1 ').subscribe((res) => {
      const body = res.body || res;
      if (body && body['data']) { this.brandData = body['data']; }
      else { this.brandData = []; }
    });
  }
  OnHSNChange(selectedId: any, data: StaticInventoryData): void {
    if (selectedId != null && selectedId != undefined && selectedId !== '') {
      const selectedProduct = this.HSNdata.find((product) => product.ID === selectedId);
      if (selectedProduct) {
        data.HSN_NAME = selectedProduct['CODE'];
      } else {
        data.HSN_NAME = null;
      }
      data.HSN_ID = selectedId;
    } else {
      data.HSN_NAME = null;
      data.HSN_ID = null;
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
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    let globalSearchQuery = '';
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
    if (this.itemNameText !== '') {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `  ITEM_NAME like '%${this.itemNameText}%'`;
    }
    if (this.catNameText !== '') {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `  INVENTORY_CATEGORY_NAME like '%${this.catNameText}%'`;
    }
    if (this.BrandNameText !== '') {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `  BRAND_NAME like '%${this.BrandNameText}%'`;
    }
    this.loadingRecords = true;
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getStaticInventoryDataAll(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }
  searchopen(): void {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter at least 3 characters to search', '');
    }
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && event.key === 'Backspace') {
      this.search(true);
    }
    if (this.itemNameText.length >= 3 && event.key === 'Enter') {
      this.search(); this.isItemNameFilterApplied = true;
    } else if (this.itemNameText.length === 0 && event.key === 'Backspace') {
      this.search(); this.isItemNameFilterApplied = false;
    }
    if (this.catNameText.length >= 3 && event.key === 'Enter') {
      this.search(); this.isCatNameFilterApplied = true;
    } else if (this.catNameText.length === 0 && event.key === 'Backspace') {
      this.search(); this.isCatNameFilterApplied = false;
    }
    if (this.BrandNameText.length >= 3 && event.key === 'Enter') {
      this.search(); this.isCatNameFilterApplied = true;
    } else if (this.BrandNameText.length === 0 && event.key === 'Backspace') {
      this.search(); this.isBrandNameFilterApplied = false;
    }
    if (this.quantityText.length > 0 && event.key === 'Enter') {
      this.search(); this.isQuantityFilterApplied = true;
    } else if (this.quantityText.length === 0 && event.key === 'Backspace') {
      this.search(); this.isQuantityFilterApplied = false;
    }
  }
  onEnterKey(event: Event): void {
    (event as KeyboardEvent).preventDefault();
  }
  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
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
  filterQuery: string = '';
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
    this.drawerFilterVisible = true;
  }
  filterFields: any[] = [
    {
      key: 'ITEM_NAME',
      label: 'Item Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Item Name',
    },
    {
      key: 'INVENTORY_CATEGORY_NAME',
      label: 'Category Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Category Name',
    },
    {
      key: 'BRAND_NAME',
      label: 'Brand Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sequence Number',
    }
  ];
  userId = sessionStorage.getItem('userId');
  USER_ID: any = this.commonFunction.decryptdata(this.userId || '');
  TabId: number;
  TAX_PREFERENCE;
  oldFilter: any[] = [];
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  filterData: any;
  currentClientId = 1;
  drawerTitle: any;
  openfilter() {
    this.drawerTitle = 'Static Inventory Filter';
    this.applyCondition = '';
    this.drawerFilterVisible = true;
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
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
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
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
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  onStatusFilterChange(val: string): void {
    this.statusFilter = val;
    this.search(true);
  }
  onItemNameFilter(): void {
    if (this.itemNameText.trim() === '') { this.search(true); return; }
    if (this.itemNameText.length >= 3) { this.search(); this.isItemNameFilterApplied = true; }
    else { this.message.warning('Please enter at least 3 characters.', ''); }
  }
  catNameText: string = '';
  onCatNameFilter(): void {
    if (this.catNameText.trim() === '') { this.search(true); return; }
    if (this.catNameText.length >= 3) { this.search(); this.isCatNameFilterApplied = true; }
    else { this.message.warning('Please enter at least 3 characters.', ''); }
  }
  BrandNameText: string = '';
  onBrandNameFilter(): void {
    if (this.BrandNameText.trim() === '') { this.search(true); return; }
    if (this.BrandNameText.length >= 3) { this.search(); this.isBrandNameFilterApplied = true; }
    else { this.message.warning('Please enter at least 3 characters.', ''); }
  }
  onDescriptionFilter(): void {
    if (this.descriptionText.trim() === '') { this.search(true); return; }
    if (this.descriptionText.length >= 3) { this.search(); this.isDescriptionFilterApplied = true; }
    else { this.message.warning('Please enter at least 3 characters.', ''); }
  }
  onQuantityFilter(): void {
    if (this.quantityText.trim() === '') { this.search(true); return; }
    this.search(); this.isQuantityFilterApplied = true;
  }
  reset(): void {
    this.searchText = '';
    this.itemNameText = '';
    this.descriptionText = '';
    this.quantityText = '';
    this.catNameText = '';
    this.BrandNameText = '';
    this.isBrandNameFilterApplied = false;
    this.isCatNameFilterApplied = false;
    this.isItemNameFilterApplied = false;
    this.isDescriptionFilterApplied = false;
    this.isQuantityFilterApplied = false;
    this.search();
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortKey = (currentSort && currentSort.key) || 'ID';
    this.sortValue = (currentSort && currentSort.value) || 'desc';
    this.search();
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
    sessionStorage.setItem('ID', item.ID);
  }
  Clearfilter(): void {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = null;
    this.isfilterapply = false;
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
          } else {
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
  toggleLiveDemo(item: any): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true;
  }
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  add(): void {
    this.dataList.forEach((d) => {
      if (d.isEditing && !d.isNew) {
        const backup = this.originalDataMap.get(d.ID);
        if (backup) {
          Object.assign(d, backup);
        }
        d.isEditing = false;
      }
    });
    this.dataList = this.dataList.filter((d) => !d.isNew);
    this.dataList.forEach((d) => (d.isEditing = false));
    const newRow: StaticInventoryData = {
      ID: 0,
      ITEM_NAME: '',
      DESCRIPTION: '',
      QUANTITY: 0,
      UNIT: '',
      IS_ACTIVE: true,
      isNew: true,
      isEditing: true,
      WARRANTY_ALLOWED: false,
      GUARANTEE_ALLOWED: false,
      HSN_NAME: '',
      HSN_ID: null,
      SELLING_PRICE: '0.00',
      BASE_PRICE: 0.00,
      COST_PRICE: 0.00,
      MARGIN: 0.00,
      CREATED_MODIFIED_DATE: '',
      READ_ONLY: 'N',
      ARCHIVE_FLAG: 'F',
      CLIENT_ID: 1,
      INVENTORY_CATEGORY_NAME: '',
      SHORT_CODE: '',
      TAX_PREFERENCE: 'NT',
      TAX_ID: null,
      TAX_NAME: '',
      SKU_CODE: null,
      BRAND_NAME: '',
      WARRANTY_PERIOD: 0,
      GUARANTEE_PERIOD: 0,
      INVENTORY_DETAILS_IMAGE: null,
      INVENTORY_CATEGORY_ID: null,
      BRAND_ID: null,
      STATUS: true,
    };
    this.dataList = [newRow, ...this.dataList];
  }
  allowDecimalOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ?? event.keyCode;
    const inputValue = (event.target as HTMLInputElement).value;
    if (charCode >= 48 && charCode <= 57) return true;
    if (charCode === 46 && !inputValue.includes('.')) return true;
    event.preventDefault();
    return false;
  }
  edit(data: StaticInventoryData): void {
    this.dataList.forEach((d) => {
      if (d.isEditing && !d.isNew) {
        const backup = this.originalDataMap.get(d.ID);
        if (backup) {
          Object.assign(d, backup);
        }
        d.isEditing = false;
      }
    });
    this.dataList = this.dataList.filter((d) => !d.isNew);
    this.originalDataMap.set(data.ID, { ...data });
    data.isEditing = true;
  }
  saveRow(data: StaticInventoryData): void {
    if (!data.ITEM_NAME || !data.ITEM_NAME.trim()) {
      this.message.error('Please Enter Item Name', ''); return;
    }
    if (!data.INVENTORY_CATEGORY_NAME || !data.INVENTORY_CATEGORY_NAME.trim()) {
      this.message.error('Please Enter Category Name', ''); return;
    }
    if (!data.BRAND_NAME || !data.BRAND_NAME.trim()) {
      this.message.error('Please Enter Brand Name', ''); return;
    }
    if (!data.SKU_CODE || !data.SKU_CODE.trim()) {
      this.message.error('Please Enter SKU Code', ''); return;
    }
    if (!data.BASE_PRICE || parseFloat(data.BASE_PRICE) <= 0) {
      this.message.error('Please Enter Valid Base Price', ''); return;
    }
    if (!data.TAX_PREFERENCE) {
      this.message.error('Please Select Tax Preference', ''); return;
    }
    if (data.TAX_PREFERENCE === 'T' && !data.TAX_ID) {
      this.message.error('Please Select Tax Slab', ''); return;
    }
    data.CLIENT_ID = 1;
    this.loadingRecords = true;
    const apiCall = data.isNew
      ? this.api.createStatucInventory(data)
      : this.api.updateStaticInventory(data);
    apiCall.subscribe(
      (res) => {
        this.loadingRecords = false;
        console.log(res);
        if (res['body'].code == 200) {
          this.message.success("Inventory saved successfully", '');
          data.isNew = false;
          data.isEditing = false;
          this.originalDataMap.delete(data.ID);
          this.search();
        } else {
          this.message.error('Something went wrong, please try again', '');
        }
      },
      () => {
        this.loadingRecords = false;
        this.message.error('Something went wrong, please try again', '');
      }
    );
  }
  onTaxPreferenceChange(preference: string, data: StaticInventoryData): void {
    data.TAX_PREFERENCE = preference;
    data.TAX_ID = null;
    data.TAX_NAME = null;
    data.SELLING_PRICE = data.BASE_PRICE;
  }
  onBasePriceChange(data: StaticInventoryData): void {
    const base = parseFloat(data.BASE_PRICE) || 0;
    if (data.TAX_PREFERENCE === 'T' && data.TAX_ID) {
      const selectedTax = this.taxData.find((t) => t.ID === data.TAX_ID);
      if (selectedTax) {
        const igst = parseFloat(selectedTax['IGST']) || 0;
        data.SELLING_PRICE = (base + (base * igst) / 100).toFixed(2);
      } else {
        data.SELLING_PRICE = String(base);
      }
    } else {
      data.SELLING_PRICE = String(base);
    }
  }
  onTaxChange(selectedId: any, data: StaticInventoryData): void {
    if (selectedId != null && selectedId !== undefined && selectedId !== '') {
      const selectedTax = this.taxData.find((product) => product.ID === selectedId);
      if (selectedTax) {
        data.TAX_NAME = selectedTax['NAME'];
        data.TAX_ID = selectedId;
        const base = parseFloat(data.BASE_PRICE) || 0;
        const igst = parseFloat(selectedTax['IGST']) || 0;
        const taxAmount = (base * igst) / 100;
        data.SELLING_PRICE = (base + taxAmount).toFixed(2);
      } else {
        data.TAX_NAME = null;
        data.SELLING_PRICE = data.BASE_PRICE;
      }
    } else {
      data.TAX_NAME = null;
      data.TAX_ID = null;
      data.SELLING_PRICE = data.BASE_PRICE;
    }
  }
  onBasePriceChangeold(data: StaticInventoryData): void {
    if (data.TAX_ID) {
      this.onTaxChange(data.TAX_ID, data);
    } else {
      data.SELLING_PRICE = data.BASE_PRICE;
    }
  }
  cancelRow(data: StaticInventoryData): void {
    if (data.isNew) {
      this.dataList = this.dataList.filter((d) => !d.isNew);
    } else {
      const backup = this.originalDataMap.get(data.ID);
      if (backup) {
        Object.assign(data, backup);
        this.originalDataMap.delete(data.ID);
      }
      data.isEditing = false;
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onWarrantyChange(data: StaticInventoryData): void {
    if (!data.WARRANTY_ALLOWED) {
      data.WARRANTY_PERIOD = 0;
    }
  }
  onGuaranteeChange(data: StaticInventoryData): void {
    if (!data.GUARANTEE_ALLOWED) {
      data.GUARANTEE_PERIOD = 0;
    }
  }
  isTextOverflow: any;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) tooltip.show();
    else tooltip.hide();
  }
  limitLength(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const digitsOnly = value.replace('.', '');
    if (digitsOnly.length > maxLength) {
      input.value = value.slice(0, value.length - (digitsOnly.length - maxLength));
      input.dispatchEvent(new Event('input'));
    }
  }
  onCategoryChange(selectedId: any, data: StaticInventoryData): void {
    if (selectedId != null && selectedId !== undefined && selectedId !== '') {
      const selected = this.categoryData.find((item) => item.ID === selectedId);
      if (selected) {
        data.INVENTORY_CATEGORY_NAME = selected['CATEGORY_NAME'];
        data.INVENTORY_CATEGORY_ID = selectedId;
      } else {
        data.INVENTORY_CATEGORY_NAME = null;
        data.INVENTORY_CATEGORY_ID = null;
      }
    } else {
      data.INVENTORY_CATEGORY_NAME = null;
      data.INVENTORY_CATEGORY_ID = null;
    }
  }
  onBrandChange(selectedId: any, data: StaticInventoryData): void {
    if (selectedId != null && selectedId !== undefined && selectedId !== '') {
      const selected = this.brandData.find((item) => item.ID === selectedId);
      if (selected) {
        data.BRAND_NAME = selected['BRAND_NAME'];
        data.BRAND_ID = selectedId;
      } else {
        data.BRAND_NAME = null;
        data.BRAND_ID = null;
      }
    } else {
      data.BRAND_NAME = null;
      data.BRAND_ID = null;
    }
  }
}