import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
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
  selector: 'app-technician-pincode-mapping',
  templateUrl: './technician-pincode-mapping.component.html',
  styleUrls: ['./technician-pincode-mapping.component.css'],
  providers: [DatePipe],
})
export class TechnicianPincodeMappingComponent {
  @Input() data: any = TechnicianMasterData;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'asc';
  sortKey: string = 'STATE_NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
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
  originalTraineeData: any[] = [];
  originalTraineeData1: any[] = [];
  stateData: any = [];
  DISTRICT_ID: any;
  STATE_ID: any;
  cityData: any = [];
  pincodeData: any = [];
  Filterss: any = {};
  logfilt: any;
  filterdata1: any;
  isSpinning11 = false;
  isSpinning22 = false;
  selectedPincode11: any = [];
  mappingdata: any = [];
  totoalrecordsss = 0;
  searchPincode;
  datalist1: any[] = [];
  selectedPincodeSet: Set<number> = new Set();
  allChecked: boolean = false;
  @Input() territoryidfilter = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  public commonFunction = new CommonFunctionService();
  useridd: any;
  vendorroleid: any;
  vendorid: any;
  ngOnInit(): void {
    this.useridd = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.vendorroleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.getStateData();
    this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
  }
  getStateData() {
    this.isStateSpinning = true;
    this.api
      .getState(
        0,
        0,
        '',
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
            this.message.error('Failed to get data', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isStateSpinning = false;
        }
      );
  }

  getCityData(stateId: number) {
    this.PincodeMappingdata = [];
    this.DISTRICT_ID = null;
    this.cityData = [];
    if (!stateId) {
      this.DISTRICT_ID = null;
      this.cityData = [];
      this.PincodeMappingdata = [];
    }
    this.isCitySpinning = true;
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND STATE_ID =' + stateId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cityData = data['data'];
            this.isCitySpinning = false;
          } else {
            this.cityData = [];
            this.message.error('Failed To Get District Data', '');
            this.isCitySpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isCitySpinning = false;
        }
      );
  }

  PincodeMapping() {
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue1.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    if (this.vendorroleid == 5 || this.vendorroleid == 9) {
      var t: any = this.territoryidfilter.split(',');
      t = t.map(Number);
    } else var t: any = [];

    this.api
      .getTechnicianunMappedpincodesData(
        0,
        0,
        this.sortKey1,
        sort,
        this.filterQuery,
        this.data.ID,
        t
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeMappingdata = data['data'];
            this.originalTraineeData = [...this.PincodeMappingdata];
            this.selectedPincode = [];
            this.tableIndeterminate = false;
          } else {
            this.PincodeMappingdata = [];
            this.selectedPincode = [];
            this.isSpinning11 = false;
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
  sortKey1: string = 'OFFICE_NAME';
  sortValue1: string = 'asc';
  sort(params: NzTableQueryParams) {
    if (this.STATE_ID && this.DISTRICT_ID) {
      this.isSpinning = true;
      this.isSpinning11 = true;
      const { pageSize, pageIndex, sort } = params;
      const currentSort = sort.find((item) => item.value !== null);
      const sortField = (currentSort && currentSort.key) || 'STATE_ID';
      const sortOrder = (currentSort && currentSort.value) || 'asc';
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      if (this.pageSize != pageSize) {
        this.pageIndex = 1;
        this.pageSize = pageSize;
      }
      if (this.sortKey1 != sortField) {
        this.pageIndex = 1;
        this.pageSize = pageSize;
      }
      this.sortKey1 = sortField;
      this.sortValue1 = sortOrder;
      this.PincodeMapping();
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
      const selectedState = this.stateData.find(
        (state) => state.ID === this.saveData.STATE_ID
      )?.NAME;
      const selectedCity = this.cityData.find(
        (city) => city.ID === this.saveData.CITY_ID
      )?.NAME;
      const selectedPincodes = this.saveData.PINCODE_ID.map((pincodeId) => {
        const pincode = this.pincodeData.find((pin) => pin.ID === pincodeId);
        return {
          PINCODE: pincode?.PINCODE,
          PINCODE_ID: pincodeId,
        };
      });
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
  // filter
  apply() {
    this.isSpinning11 = true;
    this.selectedPincodeSet.clear();

    if (
      this.STATE_ID == null ||
      this.STATE_ID == '' ||
      this.STATE_ID == undefined ||
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
      this.STATE_ID &&
      this.STATE_ID != null &&
      this.STATE_ID != undefined &&
      this.STATE_ID != '' &&
      this.STATE_ID.length != 0 &&
      this.DISTRICT_ID &&
      this.DISTRICT_ID != null &&
      this.DISTRICT_ID != undefined &&
      this.DISTRICT_ID != '' &&
      this.DISTRICT_ID.length != 0
    ) {
      this.filterQuery =
        ' AND STATE IN (' +
        this.STATE_ID +
        ')' +
        ' AND DISTRICT IN (' +
        this.DISTRICT_ID +
        ')';
      this.PincodeMapping();
    }
  }
  clear(filter) {
    this.city = [];
    this.state = [];
    this.filterQuery = {};
    this.PincodeMapping();
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
  toggleAll11(selectAll: boolean): void {
    this.allSelected1 = selectAll;
    this.tableIndeterminate11 = false;
    // Select or deselect all items
    this.mappingdata.forEach((item) => {
      item.selected = selectAll;
    });
    // Update selected pincodes
    this.selectedPincode11 = selectAll
      ? this.mappingdata.map((item) => item.ID)
      : [];
  }

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

  PincodeMapping111() {
    this.isSpinning = true;
    this.isSpinning22 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // Call the API with the constructed query
    this.api
      .getTechnicianPincodeMappedData(
        0,
        0,
        this.sortKey,
        sort,
        " AND STATUS='M' AND TECHNICIAN_ID =" + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];

            this.totoalrecordsss = this.mappingdata.length;
            this.originalTraineeData1 = [...this.mappingdata];
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

  mapdatatopincode() {
    this.isSpinning = true;

    // Ensure only the selected pincodes are included in the request
    if (this.selectedPincode.length > 0) {
      this.api
        .addTechnicianPincodeMapping(
          this.data.ID,
          this.data.NAME,
          this.selectedPincode,
          'M'
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Pincodes Successfully Mapped to the Technician.',
                ''
              );
              this.isSpinning = false;
              // Clear the selected pincodes
              this.selectedPincode = [];
              this.selectedPincodeSet = new Set();
              this.PincodeMapping111();
              this.PincodeMapping();
              this.allSelected1 = false;
              this.allSelected = false;
              this.tableIndeterminate = false;
            } else {
              this.message.error(
                'Failed to map pincodes to the technician',
                ''
              );
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
  uniqueTerritory: any = [];
  createChannel() {
    const pincodeIds: any = this.selectedPincode.map((p) => p.PINCODE_ID);
    this.api
      .getterritoryPincodeData11(
        0,
        0,
        '',
        '',
        " AND IS_ACTIVE=1 AND STATUS='M' AND TERRITORY_ID IN (" +
        pincodeIds +
        ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            if (data['count'] > 0) {
              this.uniqueTerritory = [
                ...new Set(data['data'].map((p) => p.TERRITORY_ID)),
              ];
            }
          } else {
          }
        },
        () => { }
      );
  }

  pincodeChannel: any;
  createChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      USER_ID: this.data['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.data['NAME'],
      TYPE: 'T',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.api.createChannels(data).subscribe(
      (successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  // updateChannelData() {
  //   var data: any = {
  //     CHANNEL_NAME: this.pincodeChannel,
  //     OLD_CHANNEL_NAME: this.pincodeChannelOld,
  //     USER_ID: this.data['ID'],
  //     STATUS: true,
  //     CLIENT_ID: 1,
  //     USER_NAME: this.data['NAME'],
  //     TYPE: 'V',
  //     DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
  //   }
  //   this.api
  //     .updateChannels(data)
  //     .subscribe((successCode: any) => {
  //       if (successCode.status == '200') {
  //         this.isSpinning = false;
  //       } else {
  //         this.isSpinning = false;
  //       }
  //     }, err => {
  //       this.isSpinning = false;
  //     });
  // }

  unmapdatatopincode() {
    this.isSpinning = true;

    this.api
      .addTechnicianPincodeMapping(
        this.data.ID,
        this.data.NAME,
        this.selectedPincode11,
        'U'
      )
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Pincodes Successfully Unmapped to the Technician.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];
            this.PincodeMapping111();
            this.PincodeMappingdata = [];
            this.STATE_ID = null;
            this.DISTRICT_ID = null;
            this.allSelected1 = false;
            this.allSelected = false;
            // this.drawerClose();
          } else {
            this.message.error('Failed to map pincodes to the technician', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }

  onDistChange(): void {
    this.PincodeMappingdata = [];
  }

  SearchPincode(data: any) {
    this.isSpinning = true;

    if (data && data.length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data across multiple fields
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
    } else if (data.length === 1) {
      // Reset the table data to the original dataset
      this.isSpinning = false;
      this.mappingdata = this.originalTraineeData1;
    } else {
      // If less than 3 characters, do not filter and show the original data
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

    this.api.markasinactivedata(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          data.IS_ACTIVE = selected;

          // Recalculate allChecked state
          this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);

          const message = selected
            ? 'Pincodes Successfully Mapped to the Technician.'
            : 'Pincodes Successfully Unmapped from the Technician.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to map pincodes to the technician.', '');
        }
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

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
    } else {
      // Reset to the original data
      this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));

      // Sort selected records to the top
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    }

    // Recalculate selection states
    this.updateSelectionStates();

    this.isSpinning = false;
  }

  onPincodeSelecttable(data: any, selected: boolean): void {
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

    // Track selected items based on checkbox status
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
          // Clear search and reset data
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));

          // Recalculate selection states
          this.updateSelectionStates();
          this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
        }
      }, 0);
    }
  }

  allChange(selected: boolean): void {
    this.allChecked = selected; // Set allChecked state
    this.isSpinning = true;

    // Prepare data for batch update
    // const dataToSend = this.mappingdata.map((item) => ({
    //   PINCODE_ID: item.PINCODE_ID,
    //   IS_ACTIVE: selected,
    // }));
    var dataToSend = [];
    if (selected) {
      dataToSend = this.mappingdata
        .filter((item) => !item.IS_ACTIVE) // Filter only active items
        .map((item) => ({
          PINCODE_ID: item.PINCODE_ID,
          IS_ACTIVE: selected,
        }));
    } else {
      dataToSend = this.mappingdata
        .filter((item) => item.IS_ACTIVE) // Filter only active items
        .map((item) => ({
          PINCODE_ID: item.PINCODE_ID,
          IS_ACTIVE: selected,
        }));
    }

    if (dataToSend.length == 0) {
      return;
    }

    this.api.markasinactivedata(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.IS_ACTIVE = selected;
          });
          const message = selected
            ? 'All Pincodes Successfully Mapped to the Technician.'
            : 'All Pincodes Successfully Unmapped from the Technician.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Pincodes.', '');
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        this.isSpinning = false; // Hide spinner on error
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  handlepincodeEnterKey(keys: any): void {
    const keyboardEvent = event as KeyboardEvent; // Explicitly cast to KeyboardEvent

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
          this.PincodeMapping111(); // Call PincodeMapping111 when search text is cleared
        }
      }, 0);
    }
  }
}