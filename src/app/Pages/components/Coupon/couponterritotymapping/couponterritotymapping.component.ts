import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Data } from '../couponfacilitymapping/couponfacilitymapping.component';

@Component({
  selector: 'app-couponterritotymapping',
  templateUrl: './couponterritotymapping.component.html',
  styleUrls: ['./couponterritotymapping.component.css']
})
export class CouponterritotymappingComponent implements OnInit {
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
  // filterQuery: string = '';
  filterQuery: any = {};
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    // this.getStateData();
    // this.PincodeMapping();
    this.pincodemappingdata()
    this.allChecked = this.mappingdata.every((item) => item.STATUS);
  }
  subcategoryData: any = [];
  CATEGORY_ID: any;
  SUB_CATEGORY_ID: any;
  // sortKey: string = 'STATE_NAME';
  getStateData() {
    this.SUB_CATEGORY_ID = null;
    this.CATEGORY_ID = null;
    this.subcategoryData = [];
    // this.PincodeMappingdata = [];
    this.isStateSpinning = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.api.getTerritoryMapping(this.data.ID, 0, 0, '',
      sort,
      '').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.PincodeMappingdata = data['data'];
          } else {
            this.PincodeMappingdata = [];
            this.message.error('Failed To Get Territory Data', '');
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
  // handleEnterPincodeKey(event: Event): void {
  //   const keyboardEvent = event as KeyboardEvent; // Explicitly cast to KeyboardEvent

  //   if (keyboardEvent.key === 'Enter') {
  //     keyboardEvent.preventDefault();
  //     if (this.searchPincode.trim().length >= 3) {
  //       this.SearchPincode(this.searchPincode);
  //     }
  //   }

  //   // Handle Backspace key press
  //   if (keyboardEvent.key === 'Backspace') {
  //     setTimeout(() => {
  //       // Use a small delay to ensure the model updates
  //       if (this.searchPincode.trim().length === 0) {
  //         this.PincodeMapping111(); // Call PincodeMapping111 when search text is cleared
  //       }
  //     }, 0);
  //   }
  // }
  handleEnterPincodeKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;

    // Handle Enter key press
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevent default form submission

      // Call SearchPincode if input length is >= 3
      if (this.searchPincode.trim().length >= 3) {
        this.SearchPincode(this.searchPincode);
      } else {
      }
    }

    // Handle Backspace key press
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        // Use a small delay to ensure the model updates
        if (this.searchPincode.trim().length === 0) {
          this.mappingdata = this.originalTraineeData1;
          this.PincodeMapping111();
        }
      }, 0);
    }
  }
  // SearchPincode(data: any) {
  //   this.isSpinning = true;

  //   if (data.length >= 3) {
  //     const searchTerm = data.toLowerCase();

  //     // Filter the data across multiple fields
  //     this.datalist2 = this.mappingdata.filter((record) => {
  //       return (
  //         (record.SERVICE_NAME &&
  //           record.SERVICE_NAME.toLowerCase().includes(searchTerm)) ||
  //         (record.CATEGORY_NAME &&
  //           record.CATEGORY_NAME.toLowerCase().includes(searchTerm)) ||
  //         (record.SUB_CATEGORY_NAME &&
  //           record.SUB_CATEGORY_NAME.toLowerCase().includes(searchTerm))
  //       );
  //     });

  //     this.isSpinning = false;
  //     this.mappingdata = this.datalist2.slice();
  //   } else if (data.trim().length === 0) {
  //     // Reset the table data to the original dataset
  //     this.isSpinning = false;
  //     this.mappingdata = this.mappingdataMain;
  //   } else {
  //     // If less than 3 characters, do not filter and show the original data
  //     this.isSpinning = false;
  //     this.mappingdata = this.mappingdataMain;
  //   }
  // }
  SearchPincode(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data based on the SKILL_NAME field
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          (record.TERRITORY_NAME &&
            record.TERRITORY_NAME.toLowerCase().includes(searchTerm))
          // (record.CATEGORY_NAME &&
          //   record.CATEGORY_NAME.toLowerCase().includes(searchTerm)) ||
          // (record.SUB_CATEGORY_NAME &&
          //   record.SUB_CATEGORY_NAME.toLowerCase().includes(searchTerm))
        );
      });
      this.isSpinning = false;
    } else if (data.trim().length === 0) {
      // Reset the table data to the original dataset
      this.isSpinning = false;
      this.mappingdata = [...this.originalTraineeData1];
    } else {
      // If less than 3 characters, do not filter and show the original data
      this.isSpinning = false;
    }
  }
  datalist1: any[] = [];
  originalTraineeData: any[] = [];
  originalTraineeData1: any[] = [];

  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;

    // Handle Enter key press

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      if (this.searchText.trim().length >= 3) {
        this.SearchOffice(this.searchText);
      }
    }

    // Handle Backspace key press
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchText.trim().length === 0) {
          // Reset to original data and sort selected records to the top
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));

          this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);

          // Update selection states
          this.updateSelectionStates();
        }
      }, 0);
    }
  }

  pincodemappingdata() {
    //this.isSpinning = true;
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // Call the API with the constructed query
    this.api
      .getTerritoryMapping(
        this.data.ID,
        0,
        0,
        '',
        sort,
        ''
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
            this.message.error('Failed To Get Pincode Mapping Data...', '');
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
  getNamesCatAndSub(selectedKey: any): void {
    if (selectedKey != null && selectedKey != undefined && selectedKey !== '') {
      // Find the selected subcategory and its parent category
      let parentCategoryName = null;
      let subCategoryName = null;
      let CategoryNameId = null;
      this.subcategoryData.forEach((category) => {
        if (category.children) {
          const subCategory = category.children.find(
            (child) => child.key === selectedKey
          );
          if (subCategory) {
            parentCategoryName = category.title; // Parent category name
            subCategoryName = subCategory.title; // Subcategory name
            CategoryNameId = category.key; // Subcategory name
            this.CATEGORY_NAME = parentCategoryName;
            this.SUB_CATEGORY_NAME = subCategoryName;
            this.CATEGORY_ID = CategoryNameId;
            this.splitddata = subCategory.key;
            this.SUB_CATEGORY_ID = this.splitddata;
          }
        }
      });
    } else {
      // Clear values if no subcategory is selected
      this.data.INVENTORY_CATEGORY_NAME = null;
      this.data.INVENTRY_SUB_CATEGORY_NAME = null;
      this.data.INVENTORY_CATEGORY_ID = null;
      this.data.INVENTRY_SUB_CATEGORY_ID = null;
    }
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

  // select all pincode toggle button
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      // Select all available pincodes
      this.saveData.SERVICE_ID = this.pincodeData.map((pincode) => pincode.ID);
    } else {
      // Deselect all pincodes
      this.saveData.SERVICE_ID = [];
    }
  }

  apply() {
    // this.isSpinning = true
    this.isSpinning11 = true;
    // this.filterQuery = {};

    this.selectedPincodeSet.clear();

    if (
      this.SUB_CATEGORY_ID == null ||
      this.SUB_CATEGORY_ID == undefined ||
      this.SUB_CATEGORY_ID == '' ||
      this.SUB_CATEGORY_ID.length == 0
    ) {
      this.message.error('Please select sub category.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
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
    // this.filterQuery = '';
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

    // Update Select All and Indeterminate states
    this.allSelected1 = selectedRows === totalRows && totalRows > 0;
    this.tableIndeterminate11 = selectedRows > 0 && selectedRows < totalRows;

    // Update selected pincodes
    this.selectedPincode11 = this.mappingdata
      .filter((item) => item.selected)
      .map((item) => item.SERVICE_ID);
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
    // this.sortKey = 'NAME';
    // sort = 'asc';

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // Call the API with the constructed query
    this.api
      .getmappedcouponterritory(
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

    // Ensure only the selected pincodes are included in the request
    if (this.selectedPincode.length > 0) {
      this.api
        .addBulkTerritoryForCoupon(this.data.ID, this.selectedPincode)
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Territory Successfully Mapped to the Coupon.',
                ''
              );
              this.isSpinning = false;
              // Clear the selected pincodes
              this.selectedPincode = [];
              this.selectedPincodeSet = new Set();
              this.PincodeMapping111();
              this.pincodemappingdata();
              this.allSelected1 = false;
              this.allSelected = false;
              this.tableIndeterminate = false;
            } else {
              this.message.error('Failed to Map Territory to the Coupon', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong.', '');
          }
        );
    } else {
      // Handle case where no pincode is selected
      this.message.error('No Territory selected for mapping.', '');
      this.isSpinning = false;
    }
  }

  onPincodeSelecttable11111(data: any, selected: boolean): void {
    data.STATUS = selected;

    // const dataToSend = [
    //   {
    //     COUPON_ID: this.data.ID,
    //     SERVICE_ID: data.ID,
    //     COUNTRY_ID: this.data.COUNTRY_ID,
    //     STATUS: selected,
    //     CLIENT_ID: 1,
    //     ID: data.ID,
    //     CATEGORY_ID: data.CATEGORY_ID,
    //     SUB_CATEGORY_ID: data.SUB_CATEGORY_ID,
    //     SERVICE_CATELOG_ID: data.SERVICE_CATELOG_ID
    //   },
    // ];
    this.isSpinning = true;

    this.api.UnmappSingleCouponsTerritory(data).subscribe(
      (response) => {
        if (response.code === 200) {
          // Update the active status of the current data
          data.STATUS = selected;

          // Recalculate `allChecked` state
          this.allChecked = this.mappingdata.every((item) => item.STATUS);

          // Show success message based on selection
          const successMessage = selected
            ? 'Territory Successfully mapped to the Coupon.'
            : 'Territory Successfully Unmapped to the Coupon.';
          this.message.success(successMessage, '');

          // Reset state variables
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.allSelected1 = false;
        } else if (response.code === 300) {
          // Handle error for specific code
          data.STATUS = false; // Ensure STATUS is set to false
          this.isSpinning = false;
          this.message.error(response.message, '');
        } else {
          // General failure message
          this.isSpinning = false;
          this.message.error('Failed to Map Territory to the Coupon', '');
        }
      },
      (error) => {
        // Handle API error
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  selectedPincodeSet: Set<number> = new Set();

  SearchOffice(data: string): void {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Filter the data based on the search input
      this.datalist1 = this.PincodeMappingdata.filter((record) => {
        return (
          record.NAME && record.NAME.toLowerCase().includes(data.toLowerCase())
        );
      });

      // Map the filtered data to include the selected state
      this.PincodeMappingdata = this.datalist1.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));

      // Sort selected records to the top
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    } else if (data.trim().length === 0) {
      // Reset to the original data and sort selected records to the top
      this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));

      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    }

    this.isSpinning = false;
  }

  onPincodeSelecttable(data: any, selected: boolean): void {
    // Track selected items based on checkbox status
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
    // this.loadingMessage = selectAll
    //   ? 'Selecting all records. Please wait...'
    //   : 'Deselecting all records. Please wait...';

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
    const visibleRecords = this.PincodeMappingdata; // Currently displayed data in the table
    const totalVisibleRecords = visibleRecords.length;

    // Count selected records in the visible data
    const totalSelectedVisibleRecords = visibleRecords.filter((record) =>
      this.selectedPincodeSet.has(record.ID)
    ).length;

    // Update allSelected and indeterminate states based on visible data
    this.allSelected =
      totalSelectedVisibleRecords === totalVisibleRecords &&
      totalVisibleRecords > 0;
    this.tableIndeterminate =
      totalSelectedVisibleRecords > 0 &&
      totalSelectedVisibleRecords < totalVisibleRecords;
  }

  allChecked = false;

  allChange(selected: boolean): void {
    this.allChecked = selected; // Set allChecked state
    this.isSpinning = true;

    // Prepare data for batch update
    const dataToSend = this.mappingdata.map((item) => ({
      TERRITORY_ID: item.TERRITORY_ID,
      STATUS: selected,
      COUPON_ID: this.data.ID,
      COUNTRY_ID: this.data.COUNTRY_ID,
      CLIENT_ID: 1,
      // CATEGORY_ID: item.CATEGORY_ID,
      // SUB_CATEGORY_ID: item.SUB_CATEGORY_ID,
      // SERVICE_CATELOG_ID: item.SERVICE_CATELOG_ID,
    }));
    var dataid: any = '';
    // if (this.Type == 'Map') {
    //   dataid = this.data.SERVICE_ID;
    // } else {
    //   dataid = this.data.ID;
    // }
    this.api.UnmappBulkCouponsTerritory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.STATUS = selected;
          });
          const message = selected
            ? 'All Territory Successfully Mapped to the Coupon.'
            : 'All Territory Successfully Unmapped from the Coupon.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Territory.', '');
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        this.isSpinning = false; // Hide spinner on error
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
}
