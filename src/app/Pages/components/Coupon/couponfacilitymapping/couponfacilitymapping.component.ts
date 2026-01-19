import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  PINCODE_ID: any = [];
  PINCODE: any = [];
  CATEGORY_ID: number;
  STATE_NAME: string;
  CITY_ID: number;
  CITY_NAME: string;
  STATUS: boolean = true;
  COUPON_ID: any;
  SUB_CATEGORY_ID: any;
  SERVICE_ID;
  COUNTRY_ID;
  CLIENT_ID;
  SERVICE_CATELOG_ID;
}
@Component({
  selector: 'app-couponfacilitymapping',
  templateUrl: './couponfacilitymapping.component.html',
  styleUrls: ['./couponfacilitymapping.component.css'],
})
export class CouponfacilitymappingComponent implements OnInit {
  @Input() data: any = TerritoryMaster;
  @Input() drawerClose: any = Function;
  @Input() couponFacilityMappingData: any;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'STATE_NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  PincodeMappingdatass: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = '';
  isSpinning = false;
  isStateSpinning = false;
  isPincodeSpinning = false;
  isCitySpinning = false;
  issaveSpinning = false;
  columns: string[][] = [['TRAINEE_NAME', 'TRAINEE_NAME']];
  allSelected = false;
  tableIndeterminate: boolean = false;
  tableIndeterminate11: boolean = false;
  selectedPincode: any[] = [];
  city: any[] = [];
  state: any[] = [];
  filterQuery: any = {};
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.getStateData();
    this.allChecked = this.mappingdata.every((item) => item.STATUS);
  }
  subcategoryData: any = [];
  CATEGORY_ID: any;
  SUB_CATEGORY_ID: any;
  getStateData() {
    this.SUB_CATEGORY_ID = null;
    this.CATEGORY_ID = null;
    this.subcategoryData = [];
    this.PincodeMappingdata = [];
    this.isStateSpinning = true;
    this.api.getcategoryhierarchy().subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.subcategoryData = data['data'];
        } else {
          this.subcategoryData = [];
          this.message.error('Failed To Get Category Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  pincodeData: any = [];
  searchPincode: string = '';
  datalist2: any[] = [];
  handleEnterPincodeKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); 
      if (this.searchPincode.trim().length >= 3) {
        this.SearchPincode(this.searchPincode);
      } else {
      }
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchPincode.trim().length === 0) {
          this.mappingdata = this.originalTraineeData1;
          this.PincodeMapping111();
        }
      }, 0);
    }
  }
  SearchPincode(data: any) {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          (record.SERVICE_NAME &&
            record.SERVICE_NAME.toLowerCase().includes(searchTerm)) ||
          (record.CATEGORY_NAME &&
            record.CATEGORY_NAME.toLowerCase().includes(searchTerm)) ||
          (record.SUB_CATEGORY_NAME &&
            record.SUB_CATEGORY_NAME.toLowerCase().includes(searchTerm))
        );
      });
      this.isSpinning = false;
    } else if (data.trim().length === 0) {
      this.isSpinning = false;
      this.mappingdata = [...this.originalTraineeData1];
    } else {
      this.isSpinning = false;
    }
  }
  datalist1: any[] = [];
  originalTraineeData: any[] = [];
  originalTraineeData1: any[] = [];
  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      if (this.searchText.trim().length >= 3) {
        this.SearchOffice(this.searchText);
      }
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchText.trim().length === 0) {
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));
          this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
          this.updateSelectionStates();
        }
      }, 0);
    }
  }
  pincodemappingdata() {
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getUnmappedcouponservices(
        this.data.ID,
        this.CATEGORY_ID,
        this.SUB_CATEGORY_ID,
        0,
        0,
        this.sortKey,
        sort,
        '',
        this.servieTypeFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeMappingdata = data['data'];
            this.originalTraineeData = [...this.PincodeMappingdata];
            this.selectedPincode = [];
          } else {
            this.PincodeMappingdata = [];
            this.selectedPincode = [];
            this.message.error('Failed To Get service Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning11 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning11 = false;
        }
      );
  }
  splitddata: any;
  SUB_CATEGORY_NAME: any;
  CATEGORY_NAME: any;
  selectedCategories: any[] = [];
  getNamesCatAndSub(selectedKeys: any[]): void {
    console.log('Selected Keys:', selectedKeys);
    this.selectedCategories = [];        
    this.CATEGORY_ID = [];               
    if (!selectedKeys || selectedKeys.length === 0) {
      this.CATEGORY_NAME = null;
      this.SUB_CATEGORY_NAME = null;
      this.CATEGORY_ID = [];
      this.SUB_CATEGORY_ID = [];
      this.PincodeMappingdata = [];
      return;
    }
    selectedKeys.forEach(selectedKey => {
      this.subcategoryData.forEach(parent => {
        if (parent.children && parent.children.length > 0) {
          const sub = parent.children.find(c => c.key === selectedKey);
          if (sub) {
            if (!this.CATEGORY_ID.includes(parent.key)) {
              this.CATEGORY_ID.push(parent.key);
            }
            this.selectedCategories.push({
              CATEGORY_ID: parent.key,
              CATEGORY_NAME: parent.title,
              SUB_CATEGORY_ID: sub.key,
            });
          }
        }
      });
    });
  }
  sort(params: NzTableQueryParams) {
    if (this.CATEGORY_ID && this.SUB_CATEGORY_ID) {
      this.isSpinning11 = true;
      this.isSpinning = true;
      const { pageSize, pageIndex, sort } = params;
      const currentSort = sort.find((item) => item.value !== null);
      const sortField = (currentSort && currentSort.key) || 'id';
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
      this.pincodemappingdata();
    }
  }
  close() {
    this.drawerClose();
  }
  Cancel() { }
  resetDrawer(teritorymaster: NgForm) {
    this.saveData.CATEGORY_ID = null;
    this.saveData.CITY_ID = null;
    this.saveData.PINCODE_ID = [];
    teritorymaster.form.markAsPristine();
    teritorymaster.form.markAsUntouched();
  }
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      this.saveData.SERVICE_ID = this.pincodeData.map((pincode) => pincode.ID);
    } else {
      this.saveData.SERVICE_ID = [];
    }
  }
  apply() {
    this.isSpinning11 = true;
    this.selectedPincodeSet.clear();
    this.tableIndeterminate = false;
    if (this.SUB_CATEGORY_ID == null || this.SUB_CATEGORY_ID.length == 0) {
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.SUB_CATEGORY_ID == null ||
      this.SUB_CATEGORY_ID == undefined ||
      this.SUB_CATEGORY_ID == '' ||
      this.SUB_CATEGORY_ID.length == 0
    ) {
      this.message.error('Please select sub category.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.SUB_CATEGORY_ID ||
      (this.SUB_CATEGORY_ID != null &&
        this.SUB_CATEGORY_ID != undefined &&
        this.SUB_CATEGORY_ID.length != 0)
    ) {
      this.filterQuery =
        ' AND SUB_CATEGORY_ID IN (' +
        this.SUB_CATEGORY_ID +
        ')' +
        ' AND CATEGORY_ID IN (' +
        this.CATEGORY_ID +
        ')';
      this.pincodemappingdata();
    }
  }
  clear(filter) {
    this.city = [];
    this.state = [];
    this.filterQuery = {};
    this.pincodemappingdata();
  }
  allSelected1: any;
  selectedPincode111: any;
  selectedPincode11: any = [];
  onPincodeSelecttable11(data: any, selected: boolean): void {
    data.selected = selected;
    const totalRows = this.mappingdata.length;
    const selectedRows = this.mappingdata.filter(
      (item) => item.selected
    ).length;
    this.allSelected1 = selectedRows === totalRows && totalRows > 0;
    this.tableIndeterminate11 = selectedRows > 0 && selectedRows < totalRows;
    this.selectedPincode11 = this.mappingdata
      .filter((item) => item.selected)
      .map((item) => item.SERVICE_ID);
  }
  listOfFilter1: any[] = [
    { text: 'B2B', value: 'B' },
    { text: 'B2C', value: 'C' },
    { text: 'Both', value: 'O' },
  ];
  typeFilter: string | undefined = undefined;
  servieTypeFilter: any = '';
  ontypeFilterChange(selectedStatus: string) {
    this.servieTypeFilter = selectedStatus || null;
    this.pincodemappingdata();
  }
  sort11(params: NzTableQueryParams) {
    this.isSpinning = true;
    this.isSpinning22 = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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
    this.PincodeMapping111();
  }
  mappingdata: any = [];
  mappingdataMain: any = [];
  isSpinning22: boolean = false;
  isSpinning11: boolean = false;
  PincodeMapping111() {
    this.isSpinning = true;
    this.isSpinning22 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getmappedcouponservice(
        0,
        0,
        this.sortKey,
        sort,
        ' AND COUPON_ID =' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            this.mappingdataMain = data['data'];
            this.originalTraineeData1 = [...this.mappingdata];
            this.totoalrecordsss = this.mappingdata.length;
            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item) => item.STATUS);
          } else {
            this.mappingdata = [];
            this.message.error('Failed To Get Coupon Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning22 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning22 = false;
        }
      );
  }
  totoalrecordsss = 0;
  mapdatatopincode() {
    this.isSpinning = true;
    if (this.selectedPincode.length > 0) {
      this.api
        .addBulkServicesForCoupon(this.data.ID, this.selectedPincode)
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Services Successfully Mapped to the Coupon.',
                ''
              );
              this.isSpinning = false;
              this.selectedPincode = [];
              this.selectedPincodeSet = new Set();
              this.PincodeMapping111();
              this.pincodemappingdata();
              this.allSelected1 = false;
              this.allSelected = false;
              this.tableIndeterminate = false;
            } else {
              this.message.error('Failed to Map Services to the Coupon', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong.', '');
          }
        );
    } else {
      this.message.error('No services selected for mapping.', '');
      this.isSpinning = false;
    }
  }
  onPincodeSelecttable11111(data: any, selected: boolean): void {
    data.STATUS = selected;
    this.isSpinning = true;
    this.api.UnmappSingleCoupons(data).subscribe(
      (response) => {
        if (response.code === 200) {
          data.STATUS = selected;
          this.allChecked = this.mappingdata.every((item) => item.STATUS);
          const successMessage = selected
            ? 'Service Successfully mapped to the Coupon.'
            : 'Service Successfully Unmapped to the Coupon.';
          this.message.success(successMessage, '');
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.allSelected1 = false;
        } else if (response.code === 300) {
          data.STATUS = false; 
          this.isSpinning = false;
          this.message.error(response.message, '');
        } else {
          this.isSpinning = false;
          this.message.error('Failed to Map Service to the Coupon', '');
        }
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  selectedPincodeSet: Set<number> = new Set();
  SearchOffice(data: string): void {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      this.datalist1 = this.PincodeMappingdata.filter((record) => {
        return (
          record.NAME && record.NAME.toLowerCase().includes(data.toLowerCase())
        );
      });
      this.PincodeMappingdata = this.datalist1.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    } else if (data.trim().length === 0) {
      this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    }
    this.isSpinning = false;
  }
  onPincodeSelecttable(data: any, selected: boolean): void {
    var selectedItem: any = {
      COUPON_ID: this.data.ID,
      SERVICE_ID: data.ID,
      COUNTRY_ID: this.data.COUNTRY_ID,
      STATUS: selected,
      CLIENT_ID: 1,
      CATEGORY_ID: data.CATEGORY_ID,
      SUB_CATEGORY_ID: data.SUB_CATEGORY_ID,
      SERVICE_CATELOG_ID: data.SERVICE_CATELOG_ID,
    };
    if (selected) {
      this.selectedPincodeSet.add(data.ID);
      this.selectedPincode.push(selectedItem);
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (element) => element.SERVICE_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }
  isLoading: boolean = false;
  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    const batchSize = 50;
    const totalRecords = this.PincodeMappingdata.length;
    const processBatch = async (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.PincodeMappingdata[i];
        if (selectAll) {
          const selectedItem: any = {
            COUPON_ID: this.data.ID,
            SERVICE_ID: item.ID,
            COUNTRY_ID: this.data.COUNTRY_ID,
            STATUS: true,
            CLIENT_ID: 1,
            CATEGORY_ID: item.CATEGORY_ID,
            SUB_CATEGORY_ID: item.SUB_CATEGORY_ID,
            SERVICE_CATELOG_ID: item.SERVICE_CATELOG_ID,
          };
          this.selectedPincodeSet.add(item.ID);
          this.selectedPincode.push(selectedItem);
          item.selected = true;
        } else {
          this.selectedPincodeSet.delete(item.ID);
          this.selectedPincode = [];
          item.selected = false;
        }
      }
      if (startIndex + batchSize < totalRecords) {
        setTimeout(() => processBatch(startIndex + batchSize), 0);
      } else {
        this.updateSelectionStates();
        this.isLoading = false;
      }
    };
    processBatch(0);
  }
  updateSelectionStates(): void {
    const visibleRecords = this.PincodeMappingdata; 
    const totalVisibleRecords = visibleRecords.length;
    const totalSelectedVisibleRecords = visibleRecords.filter((record) =>
      this.selectedPincodeSet.has(record.ID)
    ).length;
    this.allSelected =
      totalSelectedVisibleRecords === totalVisibleRecords &&
      totalVisibleRecords > 0;
    this.tableIndeterminate =
      totalSelectedVisibleRecords > 0 &&
      totalSelectedVisibleRecords < totalVisibleRecords;
  }
  allChecked = false;
  allChange(selected: boolean): void {
    this.allChecked = selected; 
    this.isSpinning = true;
    const dataToSend = this.mappingdata.map((item) => ({
      SERVICE_ID: item.SERVICE_ID,
      STATUS: selected,
      COUPON_ID: this.data.ID,
      COUNTRY_ID: this.data.COUNTRY_ID,
      CLIENT_ID: 1,
      CATEGORY_ID: item.CATEGORY_ID,
      SUB_CATEGORY_ID: item.SUB_CATEGORY_ID,
      SERVICE_CATELOG_ID: item.SERVICE_CATELOG_ID,
    }));
    var dataid: any = '';
    this.api.UnmappBulkCoupons(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.STATUS = selected;
          });
          const message = selected
            ? 'All Services Successfully Mapped to the Coupon.'
            : 'All Services Successfully Unmapped from the Coupon.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Services.', '');
        }
        this.isSpinning = false; 
      },
      (error) => {
        this.isSpinning = false; 
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
}