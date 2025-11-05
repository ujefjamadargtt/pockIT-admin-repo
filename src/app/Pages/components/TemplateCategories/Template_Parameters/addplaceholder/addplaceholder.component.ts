import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { StateMaster } from '../../../Models/state';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { PlaceholderMaster } from 'src/app/Pages/Models/PlaceholderMaster';

@Component({
  selector: 'app-addplaceholder',
  templateUrl: './addplaceholder.component.html',
  styleUrls: ['./addplaceholder.component.css']
})
export class AddplaceholderComponent {

  @Input()
  drawerClose!: Function;
  @Input() data: PlaceholderMaster = new PlaceholderMaster();

  // @Input() TABLE_NAME
  // @Input() TABLE_COLUMN

  @Input()
  dataList: any[] = [];
  @Input()
  data2: PlaceholderMaster[] = [];
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  public commonFunction = new CommonFunctionService();
  namepatt = /^([^0-9]*)$/;
  pinpatt = /^-?(0|[1-9]\d*)?$/;
  onlynumber = /^[0-9]*$/;

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  onCountryChange(countryId: number | null): void {
    // Reset states when the country is cleared or change
    // this.data.NAME = '';
    // this.data.SHORT_CODE = '';
  }
  ngOnInit(): void {
    // this.getCountyData();
    this.TemplateCategory();
    this.tableOptionss();
  }
  // For Accepting Only Alphabits/ Character

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(): void {
    this.drawerClose();
  }


  // keyOptions = []
  // tableOptions: any = []
  templateCategoryOptions: any = []

  countryData: any = [];
  isCountrySpinning = false;



  TemplateCategory() {
    this.isCountrySpinning = true;
    this.api
      .getTemplateCategory(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.templateCategoryOptions = data['data'];
            this.isCountrySpinning = false;
          } else {
            this.templateCategoryOptions = [];
            this.message.error('Failed To Get Template Category Data', '');
            this.isCountrySpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }



  tableOptions: any[] = [];
  @Input() keyOptions: string[] = [];
  // selectedTable: any = null;
  @Input() selectedTable: any;
  // data: any = { TABLE_COLUMN: '' };

  tableOptionss() {
    this.isCountrySpinning = true;
    this.api.getallTable(0, 0, 'TABLE_NAME', 'asc', '').subscribe(
      (data) => {
        if (data.code === 200) {
          this.tableOptions = data.data;
        } else {
          this.tableOptions = [];
          this.message.error('Failed To Get Table Options Data', '');
        }
        this.isCountrySpinning = false;
      },
      () => {
        this.message.error('Something Went Wrong', '');
        this.isCountrySpinning = false;
      }
    );
  }

  onTableSelect(selectedTable: string) {


    this.api.getallTable(0, 0, 'TABLE_NAME', 'asc', '').subscribe(
      (data) => {
        if (data.code === 200) {
          this.tableOptions = data.data;



          // Find the selected table's data and extract COLUMN_JSON
          const selectedTableData = this.tableOptions.find(
            (table: any) => table.TABLE_NAME === selectedTable
          );

          this.keyOptions = selectedTableData?.COLUMN_JSON
            ? Object.keys(selectedTableData.COLUMN_JSON)
            : [];

        } else {
          this.tableOptions = [];
          this.keyOptions = [];
          this.message.error('Failed To Get Table Options Data', '');
        }
        this.isCountrySpinning = false;
      },
      () => {
        this.message.error('Something Went Wrong', '');
        this.isCountrySpinning = false;
      }
    );


    this.data.TABLE_COLUMN = ''; // Reset the column selection when the table changes
  }



  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; // Updated pattern
    const char = String.fromCharCode(event.keyCode || event.which);

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  save(addNew: boolean, StateMasterPage: NgForm): void {


    this.isOk = true;
    if (
      this.data.TEMPLATE_CATEGORY_ID == undefined ||
      this.data.TEMPLATE_CATEGORY_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Template Category', '');
    }
    else if (
      this.selectedTable == undefined ||
      this.selectedTable == '' ||
      this.selectedTable == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select table Name', '');
    } else if (
      this.data.TABLE_COLUMN == null ||
      this.data.TABLE_COLUMN == undefined ||
      this.data.TABLE_COLUMN == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Key.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          // this.data.TABLE_NAME = this.selectedTable['TABLE_NAME']

          // 


          this.api.updateplaceholder(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('Placeholder Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Placeholder Updation Failed', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        } else {
          // this.data.TABLE_NAME = this.selectedTable

          this.api.createplaceholder(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('Placeholder Created Successfully', '');
                this.stateSeq();
                this.isSpinning = false;
                if (!addNew) this.drawerClose();
                else {
                  this.resetDrawer(StateMasterPage);
                  this.data = new PlaceholderMaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error('Placeholder Creation Failed...', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }

  stateSeq(): void {
    // this.api.getState(1, 1, 'SEQ_NO', 'desc', '').subscribe(
    //   (data) => {
    //     if (data['count'] == 0) {
    //       this.data.SEQ_NO = 1;
    //     } else {
    //       this.data.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
    //       this.data.IS_ACTIVE = true;
    //     }
    //   },
    //   (err) => { }
    // );
  }

  resetDrawer(StateMasterPage: NgForm) {
    this.data = new PlaceholderMaster();
    StateMasterPage.form.markAsPristine();
    StateMasterPage.form.markAsUntouched();
  }

}
