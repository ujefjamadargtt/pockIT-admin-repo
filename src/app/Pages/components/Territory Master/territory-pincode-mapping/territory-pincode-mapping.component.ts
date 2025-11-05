import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

export class Data {
  PINCODE_ID: any = [];
  PINCODE: any = [];
  STATE_ID: number;
  STATE_NAME: string;
  CITY_ID: number;
  CITY_NAME: string;
  IS_ACTIVE: boolean = true;
}

@Component({
  selector: 'app-territory-pincode-mapping',
  templateUrl: './territory-pincode-mapping.component.html',
  styleUrls: ['./territory-pincode-mapping.component.css'],
})
export class TerritoryPincodeMappingComponent {
  @Input() data: any = TerritoryMaster;
  @Input() drawerClose: any = Function;
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
    this.getStateData();
    // this.PincodeMapping();
    this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
  }
  stateData: any = [];
  getStateData() {
    this.STATE_ID = null;
    this.DISTRICT_ID = null;
    this.cityData = [];
    this.stateData = [];
    this.PincodeMappingdata = [];
    this.isStateSpinning = true;
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + this.data.COUNTRY_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.stateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.stateData = [];
            this.message.error('Failed To Get State Data', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isStateSpinning = false;
        }
      );
  }
  DISTRICT_ID: any;
  STATE_ID: any;
  cityData: any = [];
  pincodeData: any = [];
  // isCitySpinning = false;
  // isStateSpinning = false;
  // PincodeMappingdata: any = [];
  onStateChange(stateId: number): void {
    this.STATE_ID = stateId;
    this.searchText = '';
    this.DISTRICT_ID = null; // Clear district selection
    this.cityData = []; // Clear district data
    this.PincodeMappingdata = []; // Clear pincode mapping data

    if (stateId) {
      this.getCityData(stateId); // Fetch districts for the selected state
    }
  }
  onDistChange(): void {
    this.PincodeMappingdata = [];
    this.searchText = '';
  }

  searchPincode: string = '';
  datalist2: any[] = [];

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

  SearchPincode(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data based on the SKILL_NAME field
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          // (record.OFFICE_NAME &&
          //   record.OFFICE_NAME.toLowerCase().includes(searchTerm)) ||
          (record.STATE_NAME &&
            record.STATE_NAME.toLowerCase().includes(searchTerm)) ||
          (record.DISTRICT_NAME &&
            record.DISTRICT_NAME.toLowerCase().includes(searchTerm)) ||
          (record.TALUKA && record.TALUKA.toLowerCase().includes(searchTerm)) ||
          (record.PINCODE && record.PINCODE.toString().includes(searchTerm))
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

  getCityData(stateId: number): void {
    if (!stateId) {
      return; // No need to proceed if stateId is invalid
    }

    this.isCitySpinning = true;
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ` AND IS_ACTIVE=1 AND STATE_ID = ${stateId}`
      )
      .subscribe(
        (response) => {
          if (response['code'] === 200) {
            this.cityData = response['data'];
          } else {
            this.cityData = [];
            this.message.error('Failed to get city data.', '');
          }
          this.isCitySpinning = false;
        },
        (error) => {
          this.cityData = [];
          this.message.error(
            'Something went wrong while fetching city data.',
            ''
          );
          this.isCitySpinning = false;
        }
      );
  }

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
      .getTechnicianunMappedpincodesDataterritory(
        0,
        0,
        '',
        'asc',
        this.filterQuery,
        this.data.ID
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

  sort(params: NzTableQueryParams) {
    if (this.STATE_ID && this.DISTRICT_ID) {
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
    this.saveData.STATE_ID = null;
    this.saveData.CITY_ID = null;
    this.saveData.PINCODE_ID = [];
    teritorymaster.form.markAsPristine();
    teritorymaster.form.markAsUntouched();
  }
  // Add into table
  add(technicianmaster: NgForm): void {
    if (
      (this.saveData.PINCODE_ID == 0 ||
        this.saveData.PINCODE_ID == undefined ||
        this.saveData.PINCODE_ID == null) &&
      (this.saveData.STATE_ID == 0 ||
        this.saveData.STATE_ID == undefined ||
        this.saveData.STATE_ID == null) &&
      (this.saveData.CITY_ID == 0 ||
        this.saveData.CITY_ID == undefined ||
        this.saveData.CITY_ID == null)
    ) {
      this.message.error('Please select State and Pincode.', '');
      return;
    } else if (
      this.saveData.STATE_ID == 0 ||
      this.saveData.STATE_ID == undefined ||
      this.saveData.STATE_ID == null
    ) {
      this.message.error('Please select State.', '');
      return;
    } else if (
      this.saveData.CITY_ID == 0 ||
      this.saveData.CITY_ID == undefined ||
      this.saveData.CITY_ID == null
    ) {
      this.message.error('Please select City.', '');
      return;
    } else if (
      this.saveData.PINCODE_ID == 0 ||
      this.saveData.PINCODE_ID == undefined ||
      this.saveData.PINCODE_ID == null
    ) {
      this.message.error('Please select Pincode.', '');
      return;
    } else {
      this.issaveSpinning = true;
      // Find the selected state name
      const selectedState = this.stateData.find(
        (state) => state.ID === this.saveData.STATE_ID
      )?.NAME;
      const selectedCity = this.cityData.find(
        (city) => city.ID === this.saveData.CITY_ID
      )?.NAME;

      // Map the selected pincodes to their names and IDs
      const selectedPincodes = this.saveData.PINCODE_ID.map((pincodeId) => {
        const pincode = this.pincodeData.find((pin) => pin.ID === pincodeId);
        return {
          PINCODE: pincode?.PINCODE,
          PINCODE_ID: pincodeId,
        };
      });
      // Add entries for each selected pincode to the table

      selectedPincodes.forEach((pincode) => {
        const entry = {
          STATE_NAME: selectedState,
          STATE_ID: this.saveData.STATE_ID,
          CITY_NAME: selectedCity,
          CITY_ID: this.saveData.CITY_ID,
          ...pincode,
          IS_ACTIVE: true, // Default status
        };
        // Prevent duplicate entries
        const exists = this.PincodeMappingdata.some(
          (item) =>
            item.STATE_ID === entry.STATE_ID &&
            item.CITY_ID === entry.CITY_ID &&
            item.PINCODE_ID === entry.PINCODE_ID
        );
        if (!exists) {
          this.PincodeMappingdata.push(entry);
        }

        this.PincodeMappingdata = [...[], ...this.PincodeMappingdata];
      });
      // Reset the inputs
      this.resetDrawer(technicianmaster);
      // Notify success
      this.message.success("Pincode's added successfully.", '');
      this.issaveSpinning = false;
      this.pincodeData = [];
    }
  }
  // select all pincode toggle button
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      // Select all available pincodes
      this.saveData.PINCODE_ID = this.pincodeData.map((pincode) => pincode.ID);
    } else {
      // Deselect all pincodes
      this.saveData.PINCODE_ID = [];
    }
  }

  apply() {
    // this.isSpinning = true
    this.isSpinning11 = true;
    // this.filterQuery = {};

    this.selectedPincodeSet.clear();

    if (
      this.STATE_ID == null ||
      this.STATE_ID == undefined ||
      this.STATE_ID == '' ||
      this.STATE_ID.length == 0
    ) {
      this.message.error('Please select State.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
    }
    if (
      this.DISTRICT_ID == null ||
      this.DISTRICT_ID == undefined ||
      this.DISTRICT_ID == '' ||
      this.DISTRICT_ID.length == 0
    ) {
      this.message.error('Please select District.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
    }
    if (
      this.STATE_ID ||
      (this.STATE_ID != null &&
        this.STATE_ID != undefined &&
        this.STATE_ID.length != 0 &&
        this.DISTRICT_ID &&
        this.DISTRICT_ID != null &&
        this.DISTRICT_ID != undefined &&
        this.DISTRICT_ID.length != 0)
    ) {
      this.filterQuery =
        ' AND DISTRICT IN (' +
        this.DISTRICT_ID +
        ')' +
        ' AND STATE IN (' +
        this.STATE_ID +
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
  mapSelected() {
    this.isSpinning = true;
    // Proceed with saving data if all entries are valid
    const dataToSave = this.PincodeMappingdata.map((data) => ({
      PINCODE_ID: data.PINCODE_ID,
      IS_ACTIVE: data.IS_ACTIVE,
    }));
  }
  unmapSelected() { }
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
      .map((item) => item.PINCODE_ID);
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
    // this.sortKey = 'OFFICE_NAME';
    // sort = 'asc';

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // Call the API with the constructed query
    this.api
      .getterritoryPincodeData11(
        0,
        0,
        this.sortKey,
        sort,
        " AND STATUS='M' AND TERRITORY_ID =" + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            // this.mappingdataMain = data['data'];
            this.originalTraineeData1 = [...this.mappingdata];
            this.totoalrecordsss = this.mappingdata.length;
            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item) => item.IS_ACTIVE);
          } else {
            this.mappingdata = [];
            this.message.error('Failed To Get Pincode Mapping Data...', '');
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
        .addTechnicianPincodeMappingteroorty(
          this.data.ID,
          this.selectedPincode,
          'M'
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Pincodes Successfully Mapped to the Territory.',
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
              this.message.error('Failed to Map Pincodes to the Territory', '');
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
      this.message.error('No Pincode selected for mapping.', '');
      this.isSpinning = false;
    }
  }

  onPincodeSelecttable11111(data: any, selected: boolean): void {
    const dataToSend = [
      {
        PINCODE_ID: data.PINCODE_ID,
        IS_ACTIVE: selected,
      },
    ];
    this.isSpinning = true;

    this.api.markasinactivedatatettory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          // Update the active status of the current data
          data.IS_ACTIVE = selected;

          // Recalculate `allChecked` state
          this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);

          // Show success message based on selection
          const successMessage = selected
            ? 'Pincodes Successfully mapped to the Territory.'
            : 'Pincodes Successfully Unmapped to the Territory.';
          this.message.success(successMessage, '');

          // Reset state variables
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.allSelected1 = false;
        } else if (response.code === 300) {
          // Handle error for specific code
          data.IS_ACTIVE = false; // Ensure IS_ACTIVE is set to false
          this.isSpinning = false;
          this.message.error(response.message, '');
        } else {
          // General failure message
          this.isSpinning = false;
          this.message.error('Failed to Map Pincodes to the Territory', '');
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
          // (record.OFFICE_NAME &&
          //   record.OFFICE_NAME.toLowerCase().includes(data.toLowerCase())) ||
          (record.TALUKA &&
            record.TALUKA.toLowerCase().includes(data.toLowerCase())) ||
          (record.PINCODE && record.PINCODE.toString().includes(data))
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
      PINCODE_ID: data.ID,
      PINCODE: data.PINCODE,
      COUNTRY_NAME: data.COUNTRY_NAME,
      COUNTRY_ID: data.COUNTRY_ID,
      STATE: data.STATE,
      STATE_NAME: data.STATE_NAME,
      OFFICE_NAME: data.OFFICE_NAME,
      CIRCLE_NAME: data.CIRCLE_NAME,
      DIVISION_NAME: data.DIVISION_NAME,
      TALUKA: data.TALUKA,
      DISTRICT: data.DISTRICT,
      DISTRICT_NAME: data.DISTRICT_NAME,
      ID: data.ID,
    };

    if (selected) {
      this.selectedPincodeSet.add(data.ID);
      this.selectedPincode.push(selectedItem);
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (element) => element.PINCODE_ID !== data.ID
      );
    }

    this.updateSelectionStates();
  }

  // toggleAll(selectAll: boolean): void {
  //   this.allSelected = selectAll;
  //   this.tableIndeterminate = false;

  //   if (selectAll) {
  //     this.PincodeMappingdata.forEach((item) => {
  //       var selectedItem: any = {
  //         PINCODE_ID: item.ID,
  //         PINCODE: item.PINCODE,
  //         COUNTRY_NAME: item.COUNTRY_NAME,
  //         COUNTRY_ID: item.COUNTRY_ID,
  //         STATE: item.STATE,
  //         STATE_NAME: item.STATE_NAME,
  //         OFFICE_NAME: item.OFFICE_NAME,
  //         CIRCLE_NAME: item.CIRCLE_NAME,
  //         DIVISION_NAME: item.DIVISION_NAME,
  //         TALUKA: item.TALUKA,
  //         DISTRICT: item.DISTRICT,
  //         DISTRICT_NAME: item.DISTRICT_NAME,
  //         ID: item.ID,
  //       };
  //       this.selectedPincodeSet.add(item.ID);
  //       this.selectedPincode.push(selectedItem);
  //       item.selected = true;
  //     });
  //   } else {
  //     this.PincodeMappingdata.forEach((item) => {
  //       this.selectedPincodeSet.delete(item.ID);
  //       this.selectedPincode = [];
  //       item.selected = false;
  //     });
  //   }

  //   this.updateSelectionStates();
  // }

  isLoading: boolean = false;
  loadingMessage: string = '';

  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = selectAll
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all records. Please wait...';

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
            PINCODE_ID: item.ID,
            PINCODE: item.PINCODE,
            COUNTRY_NAME: item.COUNTRY_NAME,
            COUNTRY_ID: item.COUNTRY_ID,
            STATE: item.STATE,
            STATE_NAME: item.STATE_NAME,
            OFFICE_NAME: item.OFFICE_NAME,
            CIRCLE_NAME: item.CIRCLE_NAME,
            DIVISION_NAME: item.DIVISION_NAME,
            TALUKA: item.TALUKA,
            DISTRICT: item.DISTRICT,
            DISTRICT_NAME: item.DISTRICT_NAME,
            ID: item.ID,
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
      PINCODE_ID: item.PINCODE_ID,
      IS_ACTIVE: selected,
    }));
    var dataid: any = '';

    this.api.markasinactivedatatettory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.IS_ACTIVE = selected;
          });
          const message = selected
            ? 'All Pincodes Successfully Mapped to the Territory.'
            : 'All Pincodes Successfully Unmapped from the Territory.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Skills.', '');
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        this.isSpinning = false; // Hide spinner on error
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  fetchMappingData(selected: boolean): void {
    this.isSpinning = true;

    this.api.markasinactivedatatettory(this.data.ID, []).subscribe(
      (response) => {
        this.mappingdata = response.data || [];
        this.mappingdataMain = [...this.mappingdata];

        // Explicitly set IS_ACTIVE to false for all records
        this.mappingdata.forEach((item) => {
          item.IS_ACTIVE = false;
        });

        // Update the allChecked state to false since all items are now "off"
        this.allChecked = false;

        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Failed to Fetch Data.', '');
      }
    );
  }
}