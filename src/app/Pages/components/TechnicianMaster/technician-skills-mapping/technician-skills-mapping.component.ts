import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  SKILL_ID: any = [];
  SKILL_NAME: string;
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-technician-skills-mapping',
  templateUrl: './technician-skills-mapping.component.html',
  styleUrls: ['./technician-skills-mapping.component.css'],
})
export class TechnicianSkillsMappingComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'desc';
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
  filterQuery: string = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
  }
  stateData: any = [];

  pincodeData: any = [];

  PincodeMapping() {
    this.isSpinning = true;
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // Call the API with the constructed query
    this.api.getSkillData11(0, 0, 'NAME', 'asc', '', this.data.ID).subscribe(
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
    this.isSpinning = true;
    this.isSpinning11 = true;
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
    this.PincodeMapping();
  }
  close() {
    this.drawerClose();
  }
  Cancel() { }

  // Add into table

  // select all pincode toggle button
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      // Select all available pincodes
      this.saveData.SKILL_ID = this.pincodeData.map((pincode) => pincode.ID);
    } else {
      // Deselect all pincodes
      this.saveData.SKILL_ID = [];
    }
  }
  // filter

  unmapSelected() { }
  allSelected1: any;
  selectedPincode111: any;

  isLoading: boolean = false;
  loadingMessage: string = '';

  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = selectAll
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all selected records. Please wait...';

    const batchSize = 50;
    const totalRecords = this.PincodeMappingdata.length;

    const processBatch = async (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.PincodeMappingdata[i];
        item.selected = selectAll;

        if (selectAll) {
          this.selectedPincodeSet.add(item.ID);
          if (
            !this.selectedPincode.some(
              (selected) => selected.SKILL_ID === item.ID
            )
          ) {
            this.selectedPincode.push({ SKILL_ID: item.ID, STATUS: 'M' });
          }
        } else {
          this.selectedPincodeSet.delete(item.ID);
          this.selectedPincode = this.selectedPincode.filter(
            (selected) => selected.SKILL_ID !== item.ID
          );
        }
      }

      if (startIndex + batchSize < totalRecords) {
        setTimeout(() => processBatch(startIndex + batchSize), 0);
      } else {
        this.updateSelectionStates(); // Ensure indeterminate logic is updated
        this.isLoading = false;
      }
    };

    processBatch(0);
  }

  // Method to handle indeterminate state
  updateSelectionStates(): void {
    const totalSelected = this.PincodeMappingdata.filter(
      (item) => item.selected
    ).length;
    this.allSelected = totalSelected === this.PincodeMappingdata.length;
    this.tableIndeterminate = totalSelected > 0 && !this.allSelected;
  }

  onPincodeSelecttable(data: any, selected: boolean): void {
    data.selected = selected;

    if (selected) {
      if (!this.selectedPincode.some((item) => item.SKILL_ID === data.ID)) {
        this.selectedPincode.push({ SKILL_ID: data.ID, STATUS: 'M' });
        this.selectedPincodeSet.add(data.ID);
      }
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (item) => item.SKILL_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }

  // Function to get final formatted data
  getFormattedData() {
    return { data: this.selectedPincode };
  }

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
      .map((item) => item.SKILL_ID);
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

    // Call the API with the constructed query
    this.api
      .getTechnicianmapdata(
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
            this.message.error('Failed To Get Skill Mapping Data...', '');
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

    this.api
      .addTechnicianPincodeMappingskills(
        this.data.ID,
        this.selectedPincode,
        'M',
        'M',
        1
      )
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Skills Successfully Mapped to the Technician.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];
            this.selectedPincodeSet = new Set();
            this.PincodeMapping111();
            this.PincodeMapping();
            this.allSelected1 = false;
            this.allSelected = false;
            this.tableIndeterminate = false;
          } else {
            this.message.error('Failed to Map Skills to the Technician', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }

  unmapdatatopincode() {
    this.isSpinning = true;

    this.api
      .addTechnicianPincodeMappingskills(
        this.data.ID,
        this.selectedPincode11,
        'U',
        'U',
        0
      )
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Skills Successfully Unmapped to the Technician.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];
            this.PincodeMapping111();
            this.PincodeMapping();
            this.allSelected1 = false;
            this.allSelected = false;
            // this.drawerClose();
          } else {
            this.message.error('Failed to Map Skills to the Technician', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }

  marasisactive() {
    const inactiveData = this.mappingdata
      .filter((item) => !item.IS_ACTIVE)
      .map((item) => item.ID);

    this.isSpinning = true;

    this.api.markasinactivedataskill(this.data.ID, inactiveData).subscribe(
      (successCode) => {
        if (successCode['code'] === 200) {
          this.message.success(
            'Skills Successfully Unmapped to the Technician.',
            ''
          );
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.PincodeMapping111();
          this.allSelected1 = false;
          // this.drawerClose();
        } else {
          this.message.error('Failed to Map Skills to the Technician', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  getstatussss() {
    const inactiveData = this.mappingdata
      .filter((item) => !item.IS_ACTIVE)
      .map((item) => item.SKILL_ID);

    return inactiveData.length == 0 ? false : true;
  }

  onPincodeSelecttable11111(data: any, selected: boolean): void {
    // Prepare data for the API call
    const dataToSend = [
      {
        SKILL_ID: data.SKILL_ID,
        IS_ACTIVE: selected,
      },
    ];

    // Show spinner while processing
    this.isSpinning = true;

    // Call the API
    this.api.markasinactivedataskill(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          // Success message based on selection state
          if (!selected) {
            this.message.success(
              'Skills Successfully Unmapped to the Technician.',
              ''
            );
          } else {
            this.message.success(
              'Skills Successfully Mapped to the Technician.',
              ''
            );
          }

          // Update the local data state
          data.IS_ACTIVE = selected;

          // Recalculate 'Select All' state
          this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
        } else {
          this.message.error('Failed to Map Skill to the Technician.', '');
        }
        this.isSpinning = false; // Hide spinner
      },
      (error) => {
        this.isSpinning = false; // Hide spinner on error
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  originalTraineeData: any[] = [];

  searchskill;

  datalist1: any[] = [];
  selectedPincodeSet: Set<number> = new Set();
  SearchPincode(data: string): void {
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

  originalTraineeData1: any[] = [];

  mapsearchskill;
  SearchSkill(data: any) {
    this.isSpinning = true;

    if (data && data.trim().length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data based on the SKILL_NAME field
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          record.SKILL_NAME &&
          record.SKILL_NAME.toLowerCase().includes(searchTerm)
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

  allChecked;

  allChange(selected: boolean): void {
    this.allChecked = selected; // Set allChecked state
    this.isSpinning = true;

    // Prepare data for batch update
    const dataToSend = this.mappingdata.map((item) => ({
      SKILL_ID: item.SKILL_ID,
      IS_ACTIVE: selected,
    }));

    this.api.markasinactivedataskill(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.IS_ACTIVE = selected;
          });
          const message = selected
            ? 'All Skills Successfully Mapped to the Technician.'
            : 'All Skills Successfully Unmapped from the Technician.';
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

  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;

    // Handle Enter key press
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevent default form submission

      // Call SearchOffice if input length is >= 3
      if (this.searchskill.trim().length >= 3) {
        this.SearchPincode(this.searchskill);
      } else {
      }
    }

    // Handle Backspace key press
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        // Use a small delay to ensure the model updates
        if (this.searchskill.trim().length === 0) {
          // Reset to original data and sort selected records to the top
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));
          this.updateSelectionStates();

          // Sort selected records to the top
          this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
        }
      }, 0);
    }
  }

  handlepincodeEnterKey(keys: any): void {
    const keyboardEvent = event as KeyboardEvent; // Explicitly cast to KeyboardEvent

    // Handle Enter key press
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevent default form submission

      // Call SearchPincode if input length is >= 3
      if (this.mapsearchskill.trim().length >= 3) {
        this.SearchSkill(this.mapsearchskill);
      } else {
      }
    }

    // Handle Backspace key press
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        // Use a small delay to ensure the model updates
        if (this.mapsearchskill.trim().length === 0) {
          this.PincodeMapping111(); // Call PincodeMapping111 when search text is cleared
        }
      }, 0);
    }
  }
}