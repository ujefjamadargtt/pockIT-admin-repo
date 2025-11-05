import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-couponinventorymapping',
  templateUrl: './couponinventorymapping.component.html',
  styleUrls: ['./couponinventorymapping.component.css'],
})
export class CouponinventorymappingComponent {
  @Input() data: any = TerritoryMaster;
  @Input() drawerClose: any = Function;
  @Input() couponFacilityMappingData: any;
  @Input() drawerVisible: boolean = false;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.geTreedata();
    // this.PincodeMapping();
    this.allChecked = this.mappingdata.every((item) => item.STATUS);
  }
  subcategoryData: any = [];
  CATEGORY_ID: any;
  SUB_CATEGORY_ID: any;
  isStateSpinning = false;
  filterQuery: any = {};
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  geTreedata() {
    this.SUB_CATEGORY_ID = null;
    this.CATEGORY_ID = null;
    this.subcategoryData = [];
    this.PincodeMappingdata = [];
    this.isStateSpinning = true;
    this.api.getcategoryhierarchyInventory().subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.subcategoryData = data['data'][0]['categories'];
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

  splitddata: any;
  SUB_CATEGORY_NAME: any;
  CATEGORY_NAME: any;
  selectedPincodeSet: Set<number> = new Set();

  getNamesCatAndSub(selectedKey: any): void {
    // selectedKey = Number(selectedKey);
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
      this.data.INVENTORY_CATEGORY_NAME = null;
      this.data.INVENTORY_CATEGORY_ID = null;
      this.data.INVENTRY_SUB_CATEGORY_ID = null;
    }
  }

  isSpinning = false;
  datalist1: any[] = [];
  PincodeMappingdata: any[] = [];
  originalTraineeData: any[] = [];
  selectedPincode: any[] = [];
  isSpinning11: boolean = false;
  sortValue: string = 'desc';
  searchText: string = '';
  allChecked = false;

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
      this.MappingDataInventory();
    }
  }

  MappingDataInventory() {
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
      .getunmappedInventoryservice(
        this.data.ID,
        Number(this.CATEGORY_ID),
        this.SUB_CATEGORY_ID.includes('-')
          ? Number(this.SUB_CATEGORY_ID.split('-')[1])
          : Number(this.SUB_CATEGORY_ID),
        0,
        0,
        this.sortKey,
        sort,
        ''
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          const statusCode = data.status;
          const responseBody = data.body;
          if (statusCode == 200) {
            this.PincodeMappingdata = responseBody['data'];
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

  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;

    // Handle Enter key press

    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      if (this.searchText.trim().length >= 3) {
        this.SearchUnmappedData(this.searchText);
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


  allChange(selected: boolean): void {
    this.allChecked = selected; // Set allChecked state
    this.isSpinning = true;

    // Prepare data for batch update
    const dataToSend = this.mappingdata.map((item) => ({
      COUPON_ID: this.data.ID,
      INVENTORY_ID: item.INVENTORY_ID,
      COUNTRY_ID: this.data.COUNTRY_ID,
      STATUS: selected,
      CLIENT_ID: 1,
      INVENTORY_CATEGORY_ID: item.INVENTORY_CATEGORY_ID,
      INVENTORY_SUB_CATEGORY_ID: item.INVENTORY_SUB_CATEGORY_ID,
    }));

    this.api.unmapBulkInventory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.status === 200) {
          this.mappingdata.forEach((item) => {
            item.STATUS = selected;
          });
          const message = selected
            ? 'All Inventories Successfully Mapped to the Coupon.'
            : 'All Inventories Successfully Unmapped from the Coupon.';
          this.message.success(message, '');
        } else {
          this.message.error('Inventories Record Not Updated.', '');
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        this.isSpinning = false; // Hide spinner on error
        this.message.error('Something Went Wrong.', '');
      }
    );
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

  SearchUnmappedData(data: string): void {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Filter the data based on the search input
      this.datalist1 = this.PincodeMappingdata.filter((record) => {
        return (
          record.ITEM_NAME &&
          record.ITEM_NAME.toLowerCase().includes(data.toLowerCase())
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

  allSelected = false;
  tableIndeterminate: boolean = false;


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
            INVENTORY_ID: item.ID, // Updated field to INVENTORY_ID
            COUNTRY_ID: this.data.COUNTRY_ID,
            STATUS: true, // Assuming you want to set this to true, you can modify as needed
            CLIENT_ID: 1,
            INVENTORY_CATEGORY_ID: item.INVENTORY_CATEGORY_ID, // Updated field to INVENTORY_CATEGORY_ID
            INVENTORY_SUB_CATEGORY_ID: item.INVENTRY_SUB_CATEGORY_ID, // Updated field to INVENTORY_SUB_CATEGORY_ID
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
  isSpinning22: boolean = false;
  totoalrecordsss = 0;
  mappingdata: any = [];
  mappingdataMain: any = [];
  selectedPincode11: any = [];
  sortKey: string = 'STATE_NAME';

  AlreadyMappedData() {
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
      .getmappedinventoryservice(
        0,
        0,
        this.sortKey,
        sort,
        ' AND COUPON_ID =' + this.data.ID
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          const statusCode = data.status;
          const responseBody = data.body;
          if (statusCode == 200) {
            this.mappingdata = responseBody['data'];
            this.mappingdataMain = responseBody['data'];
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

  allSelected1: any;
  selectedPincode111: any;
  tableIndeterminate11: boolean = false;
  pageIndex = 1;
  pageSize = 10;
  datalist2: any[] = [];
  searchPincode: string = '';

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
      .map((item) => item.INVENTORY_ID);
  }

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
          this.AlreadyMappedData();
        }
      }, 0);
    }
  }

  SearchPincode(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data based on the SKILL_NAME field
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          (record.INVENTORY_NAME &&
            record.INVENTORY_NAME.toLowerCase().includes(searchTerm)) ||
          (record.INVENTORY_CATEGORY_NAME &&
            record.INVENTORY_CATEGORY_NAME.toLowerCase().includes(
              searchTerm
            )) ||
          (record.INVENTORY_SUB_CATEGORY_NAME &&
            record.INVENTORY_SUB_CATEGORY_NAME.toLowerCase().includes(
              searchTerm
            ))
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

  originalTraineeData1: any[] = [];

  onPincodeSelecttable(data: any, selected: boolean): void {
    // Track selected items based on checkbox status
    var selectedItem: any = {
      COUPON_ID: this.data.ID,
      INVENTORY_ID: data.ID,
      COUNTRY_ID: this.data.COUNTRY_ID,
      STATUS: selected,
      CLIENT_ID: 1,
      // CATEGORY_ID: data.CATEGORY_ID,
      // SUB_CATEGORY_ID: data.SUB_CATEGORY_ID,
      // SERVICE_CATELOG_ID: data.SERVICE_CATELOG_ID,
      INVENTORY_CATEGORY_ID: data.INVENTORY_CATEGORY_ID, // Updated field to INVENTORY_CATEGORY_ID
      INVENTORY_SUB_CATEGORY_ID: data.INVENTRY_SUB_CATEGORY_ID, //
    };

    if (selected) {
      this.selectedPincodeSet.add(data.ID);
      this.selectedPincode.push(selectedItem);
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (element) => element.INVENTORY_ID !== data.ID
      );
    }

    this.updateSelectionStates();
  }

  mapdatatopincode() {
    this.isSpinning = true;

    // Ensure only the selected pincodes are included in the request
    if (this.selectedPincode.length > 0) {
      this.api
        .addBulkInventoriesMap(this.data.ID, this.selectedPincode)
        .subscribe(
          (data: HttpResponse<any>) => {
            const statusCode = data.status;
            const responseBody = data.body;
            if (statusCode == 200) {
              this.message.success(
                'Inventories Successfully Mapped to the Coupon.',
                ''
              );
              this.isSpinning = false;
              // Clear the selected pincodes
              this.selectedPincode = [];
              this.selectedPincodeSet = new Set();
              this.AlreadyMappedData();
              this.MappingDataInventory();
              this.allSelected1 = false;
              this.allSelected = false;
              this.tableIndeterminate = false;
            } else {
              this.message.error('Failed to Map Inventories to the Coupon', '');
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
      this.message.error('No services selected for mapping.', '');
      this.isSpinning = false;
    }
  }

  SelectOnOFForUnmapData(data: any, selected: boolean): void {
    data.STATUS = selected;

    this.isSpinning = true;

    this.api.unmapSingleInventory(data).subscribe(
      (response) => {
        if (response.code === 200) {
          // Update the active status of the current data
          data.STATUS = selected;

          // Recalculate `allChecked` state
          this.allChecked = this.mappingdata.every((item) => item.STATUS);

          // Show success message based on selection
          const successMessage = selected
            ? 'Inventory Successfully mapped to the Coupon.'
            : 'Inventory Successfully Unmapped to the Coupon.';
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
          this.message.error('Failed to Map Inventory to the Coupon', '');
        }
      },
      (error) => {
        // Handle API error
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  unmappedsort(params: NzTableQueryParams) {
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
    this.AlreadyMappedData();
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
      this.MappingDataInventory();
    }
  }
}