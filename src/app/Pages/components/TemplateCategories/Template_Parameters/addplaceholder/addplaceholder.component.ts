import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
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
  }
  ngOnInit(): void {
    this.TemplateCategory();
    this.tableOptionss();
  }
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
  @Input() selectedTable: any;
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
    this.data.TABLE_COLUMN = ''; 
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
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
  }
  resetDrawer(StateMasterPage: NgForm) {
    this.data = new PlaceholderMaster();
    StateMasterPage.form.markAsPristine();
    StateMasterPage.form.markAsUntouched();
  }
}
