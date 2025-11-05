import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';

export class Data {
  SERVICE_ID: any;
  STATUS: boolean = true;
  MASTER_ID: any;
  CLIENT_ID: any = 1;
}

@Component({
  selector: 'app-map-help-documents',
  templateUrl: './map-help-documents.component.html',
  styleUrls: ['./map-help-documents.component.css'],
})
export class MapHelpDocumentsComponent {
  @Input() data;
  @Input() type;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'STATE_NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  PincodeMappingdataMain: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = '';
  searchText1: string = '';
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
  categoryList: any = [];
  categoryId: any;
  subCategoryId: any;
  subCategoryList: any = [];
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.checkAllChecked();
    this.getCategory();
    // this.allChecked = this.mappingdata.every((item) => item.STATUS);
  }

  stateData: any = [];
  pincodeData: any = [];
  originalTraineeData1: any[] = [];
  PincodeMapping() {
    this.isSpinning = true;
    this.isSpinning11 = true;
    this.isSpinningapply = true;

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var dataid: any = '';
    if (this.type == 'MAP') {
      dataid = this.data.SERVICE_ID;
    } else {
      dataid = this.data.ID;
    }
    // Call the API with the constructed query
    this.api
      .getUnmapDocumentsservice(
        0,
        0,
        this.sortKey,
        sort,
        ' AND STATUS=1',
        dataid,
        this.categoryId,
        this.subCategoryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeMappingdata = data['data'];
            this.PincodeMappingdataMain = data['data'];

            this.selectedPincode = [];
          } else {
            this.PincodeMappingdata = [];
            this.PincodeMappingdataMain = [];
            this.selectedPincode = [];
            this.message.error('Failed To Get skiils Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning11 = false;
          this.isSpinningapply = false;
        },
        () => {
          this.PincodeMappingdataMain = [];
          this.PincodeMappingdata = [];
          this.selectedPincode = [];
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning11 = false;
          this.isSpinningapply = false;
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
    if (this.categoryId && this.subCategoryId) {
      this.PincodeMapping();
    } else {
      this.isSpinning = false;
      this.isSpinning11 = false;
    }
  }
  close() {
    this.drawerClose();
  }
  Cancel() { }
  isSpinningapply = false;
  isSubCategorySpinning = false;
  isCategorySpinning = false;
  onCategoryChange(event) {
    if (event) {
      // this.api.get
      this.api
        .gethelpDocumentsubCategory(
          0,
          0,
          '',
          'desc',
          " AND CATEGORY_ID= '" + event + "' AND STATUS=1"
        )
        .subscribe(
          (subcategoryData) => {
            if (subcategoryData.status == 200) {
              this.subCategoryList = subcategoryData.body.data;
              this.data.SUBCATEGORY_ID = null;
              this.subCategoryId = null;
            } else {
              this.subCategoryList = [];
            }
          },
          (err) => { }
        );
    } else {
      this.subCategoryList = [];
      this.data.SUBCATEGORY_ID = null;
      this.subCategoryId = null;
    }
  }
  getCategory() {
    // this.categoryList1=[]
    this.api
      .gethelpDocumentCategory(0, 0, '', 'desc', ' AND IS_ACTIVE=1')
      .subscribe(
        (categoryData) => {
          if (categoryData.status == 200) {
            this.categoryList = categoryData.body.data;

            // categoryData.body.data.forEach((element) => {
            //     this.categoryList1.push({
            //       value: element.ID,
            //       display: element.HELP_CATEGORY_NAME,
            //     });
            //   });
          } else {
            // this.categoryList1=[]
            this.categoryList = [];
          }
        },
        (err) => { }
      );
  }

  apply() {
    // this.isSpinning = true
    this.isSpinningapply = true;
    // this.filterQuery = {};

    this.allSelected = false;
    this.tableIndeterminate = false;

    if (
      this.categoryId == null ||
      this.categoryId == undefined ||
      this.categoryId == '' ||
      this.categoryId.length == 0
    ) {
      this.message.error('Please select help category.', '');
      this.isSpinning = false;
      this.isSpinningapply = false;
    }
    if (
      this.subCategoryId == null ||
      this.subCategoryId == undefined ||
      this.subCategoryId == '' ||
      this.subCategoryId.length == 0
    ) {
      this.message.error('Please select subcategory.', '');
      this.isSpinning = false;
      this.isSpinningapply = false;
    }
    if (
      this.categoryId != null &&
      this.categoryId != undefined &&
      this.categoryId.length != 0 &&
      this.subCategoryId &&
      this.subCategoryId != null &&
      this.subCategoryId != undefined &&
      this.subCategoryId.length != 0
    ) {
      this.filterQuery =
        ' AND CATEGORY_ID IN (' +
        this.categoryId +
        ')' +
        ' AND SUBCATEGORY_ID IN (' +
        this.subCategoryId +
        ')';
      this.PincodeMapping();
    }
  }
  // Add into table

  // select all pincode toggle button
  isSelectAll: boolean = false;

  allSelected1: any;
  selectedPincode111: any;
  isLoading: boolean = false;
  loadingMessage: string = '';
  // toggleAll(selected: boolean): void {
  //   // Update visible records
  //   this.PincodeMappingdata.forEach((item) => (item.selected = selected));

  //   // Update main dataset for visible records
  //   this.PincodeMappingdataMain.forEach((item) => {
  //     if (
  //       this.PincodeMappingdata.some(
  //         (visibleItem) => visibleItem.ID === item.ID
  //       )
  //     ) {
  //       item.selected = selected;
  //     }
  //   });

  //   // Update selected list
  //   this.selectedPincode = selected
  //     ? this.PincodeMappingdata.map((item) => ({ MASTER_ID: item.ID }))
  //     : [];

  //   this.updateSelectionState();
  // }
  toggleAll(selected: boolean): void {
    this.isLoading = true; // Start loader
    this.loadingMessage = selected
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all selected records. Please wait...';

    const batchSize = 50; // Process in batches for performance
    const totalRecords = this.PincodeMappingdata.length;

    const processBatch = (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.PincodeMappingdata[i];
        item.selected = selected;

        // Update main dataset
        const mainItem = this.PincodeMappingdataMain.find(
          (mainItem) => mainItem.ID === item.ID
        );
        if (mainItem) {
          mainItem.selected = selected;
        }

        // Update selected list
        if (selected) {
          this.selectedPincode.push({ MASTER_ID: item.ID });
        } else {
          this.selectedPincode = this.selectedPincode.filter(
            (selectedItem) => selectedItem.MASTER_ID !== item.ID
          );
        }
      }

      if (startIndex + batchSize < totalRecords) {
        setTimeout(() => processBatch(startIndex + batchSize), 0); // Continue processing in batches
      } else {
        this.updateSelectionState();
        this.isLoading = false; // Stop loader when finished
      }
    };

    processBatch(0);
  }

  onPincodeSelecttable(data: any, selected: boolean): void {
    // Update the record in the main dataset
    const mainRecord = this.PincodeMappingdataMain.find(
      (item) => item.ID === data.ID
    );
    if (mainRecord) {
      mainRecord.selected = selected;
    }

    // Update the selected list
    if (selected) {
      this.selectedPincode.push({ MASTER_ID: data.ID });
    } else {
      this.selectedPincode = this.selectedPincode.filter(
        (item) => item.MASTER_ID !== data.ID
      );
    }

    // Recalculate selection states
    this.updateSelectionState();
  }

  selectedPincode11: any = [];

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

  totoalrecordsss = 0;

  BulkDocMap() {
    this.isSpinning = true;
    var dataid: any = '';
    if (this.type == 'MAP') {
      dataid = this.data.SERVICE_ID;
    } else {
      dataid = this.data.ID;
    }
    this.api
      .addDOcs(
        dataid,
        this.selectedPincode,
        1,
        this.categoryId,
        this.subCategoryId
      )
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Help Documents Successfully Mapped to the Service.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];

            this.PincodeMapping111();
            this.PincodeMapping();
            this.allSelected1 = false;
            this.allSelected = false;
            this.tableIndeterminate = false;
            // this.drawerClose();
          } else {
            this.message.error(
              'Failed to map help documents to the service',
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
  }
  ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'HelpDocument/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  // SpecificDOcmap(data: any, selected: boolean): void {
  //   const originalStatus = data['STATUS'];

  //   var dataaa = [{
  //     "MASTER_ID": data.MASTER_ID,

  //   }];

  //   this.api.specificDocMapUnmap(this.data.ID, dataaa, selected).subscribe(
  //     (successCode) => {
  //       if (successCode['code'] === 200) {
  //         if (selected) {
  //           this.allChecked = this.mappingdata.every((item) => item.STATUS);  // Check if all are selected
  //           this.message.success('Document status updated successfully.', '');
  //         } else {
  //           this.message.success('Document status updated successfully.', '');
  //         }
  //       } else {
  //         this.message.error('Failed to update document status.', '');
  //         data['STATUS'] = !originalStatus;  // Revert status if failed
  //       }
  //       this.isSpinning = false;
  //     },
  //     () => {
  //       this.isSpinning = false;
  //       this.message.error('Something Went Wrong.', '');
  //     }
  //   );
  // }

  PincodeMapping111() {
    this.isSpinning = true;
    this.isSpinning22 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var dataid: any = '';
    if (this.type == 'MAP') {
      dataid = this.data.SERVICE_ID;
    } else {
      dataid = this.data.ID;
    }
    // Call the API with the constructed query
    this.api
      .getMappedHelpDocs(0, 0, this.sortKey, sort, ' AND SERVICE_ID=' + dataid)
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            this.originalTraineeData1 = [...this.mappingdata];
            this.mappingdataMain = data['data'];
            this.totoalrecordsss = this.mappingdata.length;
            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item) => item.STATUS);
          } else {
            this.mappingdata = [];
            this.mappingdataMain = [];

            this.message.error('Failed To Get Pincode Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning22 = false;
        },
        () => {
          this.mappingdata = [];
          this.mappingdataMain = [];
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning22 = false;
        }
      );
  }

  SpecificDOcmap(data: any, selected: boolean): void {
    data['STATUS'] = selected ? true : false; // Ensure boolean
    const dataaa = [{ MASTER_ID: data.MASTER_ID }];
    var dataid: any = '';
    if (this.type == 'MAP') {
      dataid = this.data.SERVICE_ID;
    } else {
      dataid = this.data.ID;
    }
    this.api.specificDocMapUnmap(dataid, dataaa, selected).subscribe(
      (successCode) => {
        if (successCode['code'] === 200) {
          this.checkAllChecked();
          this.message.success('Document status updated successfully.', '');
        } else {
          this.message.error('Failed to update document status.', '');
          data['STATUS'] = !selected; // Revert
          this.checkAllChecked();
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        data['STATUS'] = !selected; // Revert
        this.message.error('Something Went Wrong.', '');
        this.checkAllChecked();
      }
    );
  }

  allChecked: boolean = false;

  allChange(selected: boolean): void {
    this.allChecked = selected; // Update `allChecked` state
    this.isSpinning = true;

    const dataToSend = this.mappingdata.map((item) => ({
      MASTER_ID: item.MASTER_ID,
      STATUS: selected,
    }));
    var dataid: any = '';
    if (this.type == 'MAP') {
      dataid = this.data.SERVICE_ID;
    } else {
      dataid = this.data.ID;
    }
    this.api.specificDocMapUnmap(dataid, dataToSend, selected).subscribe(
      (response) => {
        if (response.code === 200) {
          // Update STATUS for all records
          this.mappingdata.forEach((item) => {
            item.STATUS = selected;
          });

          this.message.success(
            selected
              ? 'All Documents Successfully Mapped.'
              : 'All Documents Successfully Unmapped.',
            ''
          );
        } else {
          this.message.error('Failed to Update Help Documents.', '');
        }
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }

  checkAllChecked(): void {
    this.allChecked = this.mappingdata.every(
      (item) => item.STATUS === true || item.STATUS === 1
    );
  }

  onKeypressEvent(keys: KeyboardEvent) {
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.PincodeMappingdata = this.PincodeMappingdataMain.filter(
        (item: any) => {
          const name = item['NAME']?.toLowerCase() || '';
          return name.includes(this.searchText.trim().toLowerCase());
        }
      ).map((filteredItem) => {
        const originalItem = this.PincodeMappingdataMain.find(
          (item) => item.ID === filteredItem.ID
        );
        return { ...filteredItem, selected: originalItem?.selected || false };
      });

      this.updateSelectionState(); // Ensure correct selection state after filtering
    } else if (this.searchText.length === 0 && keys.key === 'Backspace') {
      this.PincodeMappingdata = this.PincodeMappingdataMain.map((item) => ({
        ...item,
      }));

      this.updateSelectionState(); // Reset selection state when clearing search
    }
  }

  updateSelectionState() {
    const visibleSelectedCount = this.PincodeMappingdata.filter(
      (item) => item.selected
    ).length;
    const totalVisibleCount = this.PincodeMappingdata.length;

    this.allSelected =
      visibleSelectedCount === totalVisibleCount && totalVisibleCount > 0;
    this.tableIndeterminate =
      visibleSelectedCount > 0 && visibleSelectedCount < totalVisibleCount;
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.PincodeMappingdata = this.PincodeMappingdataMain.filter(
        (item: any) => {
          const name = item['NAME']?.toLowerCase() || '';

          return name.includes(this.searchText.trim().toLowerCase());
        }
      ).map((filteredItem) => {
        // Preserve selected state from original data
        const originalItem = this.PincodeMappingdataMain.find(
          (item) => item.ID === filteredItem.ID
        );
        return { ...filteredItem, selected: originalItem?.selected || false };
      });
    } else if (this.searchText.length === 0) {
      // Reset the data and preserve selection state
      this.PincodeMappingdata = this.PincodeMappingdataMain.map((item) => ({
        ...item,
      }));
    } else {
      this.message.info('Enter at least 3 characters to search', '');
    }
  }

  searchopen1(): void {
    if (this.searchText1.length >= 3) {
      this.searchDocuments();
    } else {
      this.message.info('Enter at least 3 characters to search', '');
    }
  }
  onKeypressEvent1(event: KeyboardEvent): void {
    if (this.searchText1.length >= 3 && event.key === 'Enter') {
      this.searchDocuments();
    } else if (this.searchText.length === 0 && event.key === 'Backspace') {
      // Reset the data and preserve selection state
      this.mappingdata = [...this.mappingdataMain];
    } else {
      this.message.info('Enter at least 3 characters to search', '');
    }
  }

  searchDocuments(): void {
    // Filter the data based on the search text
    if (this.searchText1 && this.searchText1.trim() !== '') {
      this.mappingdata = this.mappingdataMain.filter((data) => {
        return (
          data['MASTER_NAME'] &&
          data['MASTER_NAME']
            .toLowerCase()
            .includes(this.searchText1.toLowerCase())
        );
      });
    } else {
      // Reset to show all data if the search text is empty
      this.mappingdata = [...this.mappingdataMain];
    }
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

  searchPincode;
  SearchPincode(data: any) {
    this.isSpinning = true;

    if (data && data.length >= 3) {
      // Convert the search term to lowercase for case-insensitive comparison
      const searchTerm = data.toLowerCase();

      // Filter the data across multiple fields
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          record.MASTER_NAME &&
          record.MASTER_NAME.toLowerCase().includes(searchTerm)
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

  searchopennn() {
    if (this.searchPincode.length >= 3) {
      this.mappingdata = this.originalTraineeData1
        .filter((item: any) => {
          const name = item['MASTER_NAME']?.toLowerCase() || '';
          const subCategory =
            item['HELP_DOCUMENT_SUB_CATEGORY_NAME']?.toLowerCase() || '';
          const category = item['HELP_CATEGORY_NAME']?.toLowerCase() || '';
          const searchTerm = this.searchPincode.trim().toLowerCase();

          return (
            name.includes(searchTerm) ||
            subCategory.includes(searchTerm) ||
            category.includes(searchTerm)
          );
        })
        .map((filteredItem) => {
          // Preserve selected state from original data
          const originalItem = this.originalTraineeData1.find(
            (item) => item.ID === filteredItem.ID
          );
          return { ...filteredItem, selected: originalItem?.selected || false };
        });
    } else if (this.searchPincode.length === 0) {
      // Reset the data and preserve selection state
      this.mappingdata = this.originalTraineeData1.map((item) => ({
        ...item,
      }));
    } else {
      this.message.info('Enter at least 3 characters to search', '');
    }
  }

  viewLink(link: string): void {
    if (link) {
      window.open(link, '_blank'); // Opens the link in a new tab/window
    } else {
    }
  }
}