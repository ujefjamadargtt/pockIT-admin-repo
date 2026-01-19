import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, switchMap, forkJoin } from 'rxjs';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-sub-service-master',
  templateUrl: './sub-service-master.component.html',
  styleUrls: ['./sub-service-master.component.css'],
  providers: [DatePipe],
})
export class SubServiceMasterComponent implements OnInit {
  uniteDta: any = [];
  HSNdata: any = [];
  taxData: any = [];
  isFocused: string = '';
  isSpinning = false;
  isOk = true;
  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';
  subcategoryData: any = [];
  currencyData: any = [];
  organizationid: any = sessionStorage.getItem('orgId');
  oldservicename: any;
  @Input() data: any = ServiceCatMasterDataNew;
  @Input() dataMain: any = ServiceCatMasterDataNew;
  @Input() drawerVisible: boolean = false;
  @Input() parentId: any;
  @Input() sername: any;
  @Input() drawerClose: any = Function;
  SkilssData: any = [];
  uploadedImage: any = '';
  uploadedImage1: any = '';
  CAN_CHANGE_SERVICE_PRICE1: any = sessionStorage.getItem(
    'CAN_CHANGE_SERVICE_PRICE'
  );
  CAN_CHANGE_SERVICE_PRICE_STATUS: any = 0;
  ngOnInit(): void {
    if (this.data?.ID) {
      const html = this.data.DESCRIPTION || '';
      this.cleanTextLength = html.length;
      this.showLengthError = html.length > this.maxLength;
    }
    this.organizationid = sessionStorage.getItem('orgId');
    this.data.ORG_ID = 1;
    this.CAN_CHANGE_SERVICE_PRICE1 = sessionStorage.getItem(
      'CAN_CHANGE_SERVICE_PRICE'
    );
    this.CAN_CHANGE_SERVICE_PRICE_STATUS = this.CAN_CHANGE_SERVICE_PRICE1
      ? this.commonFunction.decryptdata(this.CAN_CHANGE_SERVICE_PRICE1)
      : 0;
    if (this.data.ID) {
      this.oldservicename = this.data.NAME;
      this.api.getServiceDetailsGetForHTMLContent(this.data.ID).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            if (successCode['count'] > 0) {
              this.data.FILE_CONTENT = successCode['data'][0]['FILE_CONTENT'];
            } else {
              this.data.FILE_CONTENT = '';
            }
          } else {
            this.data.FILE_CONTENT = '';
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          this.data.FILE_CONTENT = '';
        }
      );
    }
    this.api.getSkillData(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1').subscribe(
      (successCode: any) => {
        if (successCode.code == '200') {
          this.SkilssData = successCode['data'];
        } else {
          this.SkilssData = [];
        }
      },
      (err: HttpErrorResponse) => {
        this.SkilssData = [];
      }
    );
    this.getSubCategoryData();
    this.getUnits();
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.SERVICE_IMAGE != null &&
      this.data.SERVICE_IMAGE != undefined &&
      this.data.SERVICE_IMAGE != ' '
    ) {
      this.uploadedImage = this.data.SERVICE_IMAGE;
    } else {
    }
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.SERVICE_DETAILS_IMAGE != null &&
      this.data.SERVICE_DETAILS_IMAGE != undefined &&
      this.data.SERVICE_DETAILS_IMAGE != ' '
    ) {
      this.uploadedImage1 = this.data.SERVICE_DETAILS_IMAGE;
    } else {
    }
  }
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '90px',
    minHeight: '0',
    maxHeight: '200px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Details here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript'],
      ['customClasses', 'insertVideo', 'insertImage'],
    ],
  };
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  disableBeforeCurrentHour = (): number[] => {
    const hours: number[] = [];
    for (let i = 0; i < this.currentHour; i++) {
      hours.push(i);
    }
    return hours;
  };
  disableBeforeCurrentMinutes = (selectedHour: number): number[] => {
    const minutes: number[] = [];
    if (selectedHour === this.currentHour) {
      for (let i = 0; i < this.currentMinute; i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };
  disableBeforeStartHour = (): number[] => {
    if (!this.data.START_TIME) {
      return [];
    }
    const startHour = this.data.START_TIME.getHours();
    const hours: number[] = [];
    for (let i = 0; i <= startHour; i++) {
      hours.push(i);
    }
    return hours;
  };
  disableBeforeStartMinutes = (selectedHour: number): number[] => {
    if (!this.data.START_TIME) {
      return [];
    }
    const startHour = this.data.START_TIME.getHours();
    const startMinute = this.data.START_TIME.getMinutes();
    const minutes: number[] = [];
    if (selectedHour === startHour) {
      for (let i = 0; i <= startMinute; i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };
  disableStartHours: () => number[] = () => [];
  disableStartMinutes: (hour: number) => number[] = () => [];
  disableEndHours: () => number[] = () => [];
  disableEndMinutes: (hour: number) => number[] = () => [];
  orgStartHour: number = 0;
  orgStartMinute: number = 0;
  orgEndHour: number = 23;
  orgEndMinute: number = 59;
  getSubCategoryData() {
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
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              const startParts =
                data['body']['data'][0].DAY_START_TIME.split(':');
              this.orgStartHour = +startParts[0];
              this.orgStartMinute = +startParts[1];
              if (!this.data.ID) {
                this.data.START_TIME = new Date().setHours(
                  this.orgStartHour,
                  this.orgStartMinute,
                  0
                );
              }
            }
            if (data['body']['data'][0].DAY_END_TIME) {
              const endParts = data['body']['data'][0].DAY_END_TIME.split(':');
              this.orgEndHour = +endParts[0];
              this.orgEndMinute = +endParts[1];
              if (!this.data.ID) {
                this.data.END_TIME = new Date().setHours(
                  this.orgEndHour,
                  this.orgEndMinute,
                  0
                );
              }
            }
            this.initializeTimeRestrictions();
            if (data['body'].count > 0 && !this.data.ID) {
              if (
                data['body']['data'][0].DAY_START_TIME != undefined &&
                data['body']['data'][0].DAY_START_TIME != null &&
                data['body']['data'][0].DAY_START_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_START_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.START_TIME = new Date(today);
                }
              }
              if (
                data['body']['data'][0].DAY_END_TIME != undefined &&
                data['body']['data'][0].DAY_END_TIME != null &&
                data['body']['data'][0].DAY_END_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_END_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.END_TIME = new Date(today);
                }
              }
            }
          }
        }
      });
  }
  initializeTimeRestrictions() {
    this.disableStartHours = () =>
      Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < this.orgStartHour || hour > this.orgEndHour
      );
    this.disableStartMinutes = (hour: number) =>
      hour === this.orgStartHour
        ? Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute < this.orgStartMinute
        )
        : hour === this.orgEndHour
          ? Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute > this.orgEndMinute
          )
          : [];
    this.disableEndHours = () => {
      const startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour || hour > this.orgEndHour
      );
    };
    this.disableEndMinutes = (hour: number) => {
      const startHour = this.getStartHour();
      const startMinute = this.getStartMinute();
      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
  }
  getStartHour() {
    return this.data.START_TIME
      ? new Date(this.data.START_TIME).getHours()
      : this.orgStartHour;
  }
  getStartMinute() {
    return this.data.START_TIME
      ? new Date(this.data.START_TIME).getMinutes()
      : this.orgStartMinute;
  }
  onStartTimeChange() {
    this.data.END_TIME = null;
    const selectedTime = new Date(this.data.START_TIME);
    this.data.START_TIME = this.roundMinutesToNearestInterval(selectedTime);
    this.initializeTimeRestrictions();
  }
  roundMinutesToNearestInterval(date: Date): Date {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 10) * 10;
    let finalHour = date.getHours();
    let finalMinutes = roundedMinutes;
    if (roundedMinutes >= 60) {
      finalMinutes = 0;
      finalHour = (finalHour + 1) % 24; 
    }
    const roundedDate = new Date(date);
    roundedDate.setHours(finalHour);
    roundedDate.setMinutes(finalMinutes);
    roundedDate.setSeconds(0);
    return roundedDate;
  }
  resetDrawer(ServiceCatmaster: NgForm) {
    this.data = new ServiceCatMasterDataNew();
    this.data.QTY = 1;
    this.data.MAX_QTY = 1;
    this.data.UNIT_ID = 1;
    this.organizationid = sessionStorage.getItem('orgId');
    this.data.ORG_ID = 1;
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              const startParts =
                data['body']['data'][0].DAY_START_TIME.split(':');
              this.orgStartHour = +startParts[0];
              this.orgStartMinute = +startParts[1];
              if (!this.data.ID) {
                this.data.START_TIME = new Date().setHours(
                  this.orgStartHour,
                  this.orgStartMinute,
                  0
                );
              }
            }
            if (data['body']['data'][0].DAY_END_TIME) {
              const endParts = data['body']['data'][0].DAY_END_TIME.split(':');
              this.orgEndHour = +endParts[0];
              this.orgEndMinute = +endParts[1];
              if (!this.data.ID) {
                this.data.END_TIME = new Date().setHours(
                  this.orgEndHour,
                  this.orgEndMinute,
                  0
                );
              }
            }
            this.initializeTimeRestrictions();
            if (data['body'].count > 0 && !this.data.ID) {
              if (
                data['body']['data'][0].DAY_START_TIME != undefined &&
                data['body']['data'][0].DAY_START_TIME != null &&
                data['body']['data'][0].DAY_START_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_START_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.START_TIME = new Date(today);
                }
              }
              if (
                data['body']['data'][0].DAY_END_TIME != undefined &&
                data['body']['data'][0].DAY_END_TIME != null &&
                data['body']['data'][0].DAY_END_TIME != ''
              ) {
                const today = new Date();
                const timeParts =
                  data['body']['data'][0].DAY_END_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.END_TIME = new Date(today);
                }
              }
            }
          }
        }
      });
    ServiceCatmaster.form.markAsPristine();
    ServiceCatmaster.form.markAsUntouched();
  }
  getUnits() {
    this.api
      .getUnitData(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.uniteDta = data['data'];
          if (!this.data.ID) {
            if (data['count'] > 0) {
              this.data.UNIT_ID = 1;
              this.data.UNIT_NAME = this.uniteDta[0].NAME;
            }
          }
        } else {
          this.uniteDta = [];
        }
      });
    this.api
      .getAllHSNSAC(0, 0, 'ID', 'desc', ' AND STATUS =1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.HSNdata = data['data'];
        } else {
          this.HSNdata = [];
        }
      });
    this.api
      .getTaxData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.taxData = data['data'];
        } else {
          this.taxData = [];
        }
      });
  }
  changeAmount(event: any) {
    if (event == 'B') {
      this.data.B2C_PRICE = null;
    } else if (event == 'C') {
      this.data.B2B_PRICE = null;
    } else {
    }
  }
  hsnChange(hsnno: any) {
    if (hsnno !== '' && hsnno !== null && hsnno != undefined) {
      var hsnnumber: any = this.HSNdata.filter(
        (element) => element.ID == hsnno
      );
      if (hsnnumber !== '' && hsnnumber !== null && hsnnumber != undefined) {
        this.data.HSN_CODE = hsnnumber[0].CODE;
      } else {
        this.data.HSN_CODE = null;
      }
    } else {
      this.data.HSN_CODE = null;
    }
  }
  taxChange(hsnno: any) {
    if (hsnno !== '' && hsnno !== null && hsnno != undefined) {
      var hsnnumber: any = this.taxData.filter(
        (element) => element.ID == hsnno
      );
      if (hsnnumber !== '' && hsnnumber !== null && hsnnumber != undefined) {
        this.data.TAX_NAME = hsnnumber[0].NAME;
      } else {
        this.data.TAX_NAME = null;
      }
    } else {
      this.data.TAX_NAME = null;
    }
  }
  unitChange(hsnno: any) {
    if (hsnno !== '' && hsnno !== null && hsnno != undefined) {
      var hsnnumber: any = this.uniteDta.filter(
        (element) => element.ID == hsnno
      );
      if (hsnnumber !== '' && hsnnumber !== null && hsnnumber != undefined) {
        this.data.UNIT_NAME = hsnnumber[0].NAME;
      } else {
        this.data.UNIT_NAME = null;
      }
    } else {
      this.data.UNIT_NAME = null;
    }
  }
  prepareDescriptionWithUploads(
    html: string,
    callback: (updatedHtml: string) => void
  ): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const imgElements = Array.from(tempDiv.querySelectorAll('img'));
    const uploadObservables: Observable<any>[] = [];
    const replacements: { element: HTMLImageElement; filename: string }[] = [];
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && (src.startsWith('data:image/') || src.startsWith('blob:'))) {
        const filename = `image_${Date.now()}_${Math.floor(
          Math.random() * 10000
        )}.png`;
        const obs = this.convertSrcToFile(src).pipe(
          switchMap((file) => this.api.onUpload2('Item', file, filename))
        );
        uploadObservables.push(obs);
        replacements.push({ element: img, filename });
      }
    });
    if (uploadObservables.length === 0) {
      callback(tempDiv.innerHTML);
      return;
    }
    forkJoin(uploadObservables).subscribe(() => {
      replacements.forEach((rep) => {
        const url = `${this.api.retriveimgUrl}Item/${rep.filename}`;
        rep.element.setAttribute('src', url);
      });
      callback(tempDiv.innerHTML);
    });
  }
  convertSrcToFile(src: string): Observable<File> {
    return new Observable((observer) => {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `image_${Date.now()}.png`, {
            type: blob.type,
          });
          observer.next(file);
          observer.complete();
        });
    });
  }
  cleanTextLength = 0;
  showLengthError = false;
  maxLength = 50000;
  checkDescriptionLength(): void {
    const html = this.data.DESCRIPTION || '';
    const totalLength = html.length;
    this.cleanTextLength = totalLength;
    this.showLengthError = totalLength > this.maxLength;
    if (this.showLengthError) {
      const truncated = html.slice(0, this.maxLength);
      this.data.DESCRIPTION = '';
      setTimeout(() => {
        this.data.DESCRIPTION = truncated;
        this.cleanTextLength = truncated.length;
      });
    }
  }
  save(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isOk = true;
    const isBlobInDescription =
      this.data.DESCRIPTION && this.data.DESCRIPTION.includes('data:image');
    if (isBlobInDescription) {
      this.prepareDescriptionWithUploads(
        this.data.DESCRIPTION,
        (updatedHtml) => {
          this.data.DESCRIPTION = updatedHtml;
          this.continueSave(addNew, ServiceCatmaster);
        }
      );
    } else {
      this.continueSave(addNew, ServiceCatmaster);
    }
  }
  continueSave(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter service name', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE == 0
    ) {
      this.isOk = false;
      this.message.error('Please enter short code.', '');
    } else if (
      this.data.DESCRIPTION == null ||
      this.data.DESCRIPTION == undefined ||
      this.data.DESCRIPTION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter description', '');
    } else if (
      this.data.SERVICE_IMAGE == null ||
      this.data.SERVICE_IMAGE == undefined ||
      this.data.SERVICE_IMAGE == '' ||
      this.data.SERVICE_IMAGE == ' '
    ) {
      this.isOk = false;
      this.message.error('Please select service image', '');
    } else if (
      !this.data.IS_PARENT &&
      (this.data.SERVICE_TYPE == null ||
        this.data.SERVICE_TYPE == undefined ||
        this.data.SERVICE_TYPE == '')
    ) {
      this.isOk = false;
      this.message.error('Please select service type', '');
    } else if (
      this.data.TAX_ID == 0 ||
      this.data.TAX_ID == null ||
      this.data.TAX_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please select tax slab name', '');
    } else if (
      (this.data.SERVICE_TYPE == 'C' || this.data.SERVICE_TYPE == 'O') &&
      (this.data.B2C_PRICE == null ||
        this.data.B2C_PRICE == undefined ||
        this.data.B2C_PRICE == '' ||
        this.data.B2C_PRICE <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please enter service price for B2C (₹)', '');
    } else if (
      (this.data.SERVICE_TYPE == 'B' || this.data.SERVICE_TYPE == 'O') &&
      (this.data.B2B_PRICE === null ||
        this.data.B2B_PRICE === undefined ||
        this.data.B2B_PRICE === '')
    ) {
      this.isOk = false;
      this.message.error(' Please enter service price for B2B (₹)', '');
    } else if (
      this.data.TECHNICIAN_COST === null ||
      this.data.TECHNICIAN_COST === undefined ||
      this.data.TECHNICIAN_COST === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter technician cost', '');
    } else if (
      this.data.VENDOR_COST === null ||
      this.data.VENDOR_COST === undefined ||
      this.data.VENDOR_COST === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter vendor cost', '');
    } else if (
      this.data.IS_EXPRESS &&
      (this.data.EXPRESS_COST === null ||
        this.data.EXPRESS_COST === undefined ||
        this.data.EXPRESS_COST === '' ||
        this.data.EXPRESS_COST <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please enter express service price for B2C (₹)', '');
    } else if (
      this.data.QTY == undefined ||
      this.data.QTY == null ||
      this.data.QTY == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter quantity.', '');
    } else if (
      this.data.UNIT_ID == 0 ||
      this.data.UNIT_ID == null ||
      this.data.UNIT_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please select unit.', '');
    } else if (
      this.data.MAX_QTY == undefined ||
      this.data.MAX_QTY == null ||
      this.data.MAX_QTY == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter max order quantity.', '');
    } else if (
      this.data.DURARTION_HOUR === null ||
      this.data.DURARTION_HOUR === undefined ||
      this.data.DURARTION_HOUR === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter service hours', '');
    } else if (
      this.data.DURARTION_MIN === null ||
      this.data.DURARTION_MIN === undefined ||
      this.data.DURARTION_MIN === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter service minutes', '');
    } else if (
      this.data.DURARTION_HOUR !== null &&
      this.data.DURARTION_HOUR !== undefined &&
      this.data.DURARTION_HOUR !== '' &&
      this.data.DURARTION_HOUR <= 0 &&
      this.data.DURARTION_MIN !== null &&
      this.data.DURARTION_MIN !== undefined &&
      this.data.DURARTION_MIN !== '' &&
      this.data.DURARTION_MIN <= 0
    ) {
      this.isOk = false;
      this.message.error('Service duration must be greater than 0', '');
    } else if (
      this.data.PREPARATION_HOURS === null ||
      this.data.PREPARATION_HOURS === undefined ||
      this.data.PREPARATION_HOURS === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter service preparation hours', '');
    } else if (
      this.data.PREPARATION_MINUTES === null ||
      this.data.PREPARATION_MINUTES === undefined ||
      this.data.PREPARATION_MINUTES === ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter service preparation minutes', '');
    } else if (
      this.data.PREPARATION_HOURS !== null &&
      this.data.PREPARATION_HOURS !== undefined &&
      this.data.PREPARATION_HOURS !== '' &&
      this.data.PREPARATION_HOURS <= 0 &&
      this.data.PREPARATION_MINUTES !== null &&
      this.data.PREPARATION_MINUTES !== undefined &&
      this.data.PREPARATION_MINUTES !== '' &&
      this.data.PREPARATION_MINUTES <= 0
    ) {
      this.isOk = false;
      this.message.error('Service preparation time must be greater than 0', '');
    } else if (
      !this.data.ID &&
      (this.data.SERVICE_SKILLS == undefined ||
        this.data.SERVICE_SKILLS == null ||
        this.data.SERVICE_SKILLS == '')
    ) {
      this.isOk = false;
      this.message.error('Please select skills', '');
    } else if (
      this.data.WARRANTY_ALLOWED &&
      (this.data.WARRANTY_PERIOD === null ||
        this.data.WARRANTY_PERIOD === undefined ||
        this.data.WARRANTY_PERIOD === '' ||
        this.data.WARRANTY_PERIOD <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please enter warranty period', '');
    } else if (
      this.data.GUARANTEE_ALLOWED &&
      (this.data.GUARANTEE_PERIOD === null ||
        this.data.GUARANTEE_PERIOD === undefined ||
        this.data.GUARANTEE_PERIOD === '' ||
        this.data.GUARANTEE_PERIOD <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please enter guarantee period', '');
    } else if (
      this.data.START_TIME == undefined ||
      this.data.START_TIME == null ||
      this.data.START_TIME == 0
    ) {
      this.isOk = false;
      this.message.error(' Please select start time.', '');
    } else if (
      this.data.END_TIME == undefined ||
      this.data.END_TIME == null ||
      this.data.END_TIME == 0
    ) {
      this.isOk = false;
      this.message.error(' Please select end time.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (
        this.data.START_TIME != undefined &&
        this.data.START_TIME != null &&
        this.data.START_TIME != ''
      ) {
        this.data.START_TIME = this.datePipe.transform(
          new Date(this.data.START_TIME),
          'HH:mm'
        );
      }
      if (
        this.data.END_TIME != undefined &&
        this.data.END_TIME != null &&
        this.data.END_TIME != ''
      ) {
        this.data.END_TIME = this.datePipe.transform(
          new Date(this.data.END_TIME),
          'HH:mm'
        );
      }
      {
        if (!this.data.IS_EXPRESS) {
          this.data.EXPRESS_COST = null;
        }
        if (!this.data.WARRANTY_ALLOWED) {
          this.data.WARRANTY_PERIOD = null;
        }
        if (!this.data.GUARANTEE_ALLOWED) {
          this.data.GUARANTEE_PERIOD = null;
        }
        this.data.SUB_CATEGORY_ID = this.dataMain.SUB_CATEGORY_ID;
        this.data.SUB_CATEGORY_NAME = this.dataMain.SUB_CATEGORY_NAME;
        this.data.CATEGORY_NAME = this.dataMain.CATEGORY_NAME;
        this.data.IS_PARENT = false;
        this.data.PARENT_ID = this.parentId;
        this.data.CUSTOMER_ID = 0;
        this.data.TERRITORY_ID = 0;
        this.data.IS_FOR_B2B = false;
        if (this.data.ID) {
          this.data.OLD_SERVICE_NAME = this.oldservicename;
          if (this.data.SERVICE_IMAGE.includes('?t=')) {
            this.data.SERVICE_IMAGE = this.data.SERVICE_IMAGE.split('?')[0];
          }
          this.api.updateServiceMain(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Sub Service Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.info(
                  'A service with the same short code already exists.',
                  ''
                );
                this.isSpinning = false;
                if (
                  this.data.START_TIME != undefined &&
                  this.data.START_TIME != null &&
                  this.data.START_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.START_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.START_TIME = new Date(today);
                  }
                }
                if (
                  this.data.END_TIME != undefined &&
                  this.data.END_TIME != null &&
                  this.data.END_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.END_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.END_TIME = new Date(today);
                  }
                }
              } else {
                this.message.error('Sub Service Updation Failed', '');
                this.isSpinning = false;
                if (
                  this.data.START_TIME != undefined &&
                  this.data.START_TIME != null &&
                  this.data.START_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.START_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.START_TIME = new Date(today);
                  }
                }
                if (
                  this.data.END_TIME != undefined &&
                  this.data.END_TIME != null &&
                  this.data.END_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.END_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.END_TIME = new Date(today);
                  }
                }
              }
            },
            (err: HttpErrorResponse) => {
              this.isSpinning = false;
              if (err.status === 0) {
                this.message.error(
                  'Network error: Please check your internet connection.',
                  ''
                );
              } else {
                this.message.error('Something Went Wrong.', '');
              }
              if (
                this.data.START_TIME != undefined &&
                this.data.START_TIME != null &&
                this.data.START_TIME != ''
              ) {
                const today = new Date();
                const timeParts = this.data.START_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.START_TIME = new Date(today);
                }
              }
              if (
                this.data.END_TIME != undefined &&
                this.data.END_TIME != null &&
                this.data.END_TIME != ''
              ) {
                const today = new Date();
                const timeParts = this.data.END_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.END_TIME = new Date(today);
                }
              }
            }
          );
        } else {
          this.data.OLD_SERVICE_NAME = null;
          this.api.createServiceMain(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('New sub service added successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new ServiceCatMasterDataNew();
                  this.resetDrawer(ServiceCatmaster);
                }
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.info(
                  'A service with the same short code already exists.',
                  ''
                );
                this.isSpinning = false;
                if (
                  this.data.START_TIME != undefined &&
                  this.data.START_TIME != null &&
                  this.data.START_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.START_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.START_TIME = new Date(today);
                  }
                }
                if (
                  this.data.END_TIME != undefined &&
                  this.data.END_TIME != null &&
                  this.data.END_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.END_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.END_TIME = new Date(today);
                  }
                }
              } else {
                this.message.error('Failed to add new sub service', '');
                this.isSpinning = false;
                if (
                  this.data.START_TIME != undefined &&
                  this.data.START_TIME != null &&
                  this.data.START_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.START_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.START_TIME = new Date(today);
                  }
                }
                if (
                  this.data.END_TIME != undefined &&
                  this.data.END_TIME != null &&
                  this.data.END_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.data.END_TIME.split(':'); 
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.data.END_TIME = new Date(today);
                  }
                }
              }
            },
            (err: HttpErrorResponse) => {
              this.isSpinning = false;
              if (err.status === 0) {
                this.message.error(
                  'Network error: Please check your internet connection.',
                  ''
                );
              } else {
                this.message.error('Something Went Wrong.', '');
              }
              if (
                this.data.START_TIME != undefined &&
                this.data.START_TIME != null &&
                this.data.START_TIME != ''
              ) {
                const today = new Date();
                const timeParts = this.data.START_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.START_TIME = new Date(today);
                }
              }
              if (
                this.data.END_TIME != undefined &&
                this.data.END_TIME != null &&
                this.data.END_TIME != ''
              ) {
                const today = new Date();
                const timeParts = this.data.END_TIME.split(':'); 
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.data.END_TIME = new Date(today);
                }
              }
            }
          );
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
  CropImageModalVisible = false;
  isSpinningCrop = false;
  cropimageshow: any;
  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    this.CropImageModalVisible = true;
    this.cropimageshow = true;
    this.imageChangedEvent = event;
  }
  cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
  imageCropped2(event: any) {
    this.enhanceImageQuality(event.base64, 200, 200);
  }
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const sizeInMB = blob.size / (1024 * 1024); 
        if (sizeInMB > 1 && quality > 0.1) {
          this.compressImage(canvas, quality - 0.1);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
          };
        }
      },
      'image/jpeg',
      quality
    ); 
  }
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
    }, 50);
    this.imageWidth = event.original.size.width;
    this.imageHeight = event.original.size.height;
  }
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;
    cropWidth = 200;
    cropHeight = 200;
    this.enhanceImageQuality(event.base64, cropWidth, cropHeight);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }
  async enhanceImageQuality(
    base64: string,
    finalWidth: number,
    finalHeight: number
  ): Promise<void> {
    try {
      this.croppedImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = 'Anonymous';
        img.onload = async () => {
          await img.decode(); 
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas context not available');
          canvas.width = finalWidth * 2;
          canvas.height = finalHeight * 2;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const downscaleCanvas = (
            sourceCanvas: HTMLCanvasElement,
            width: number,
            height: number
          ) => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            if (!newCtx) return sourceCanvas;
            newCanvas.width = width;
            newCanvas.height = height;
            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';
            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };
          let currentCanvas = canvas;
          const downscaleSteps = [
            [Math.floor(finalWidth * 1.5), Math.floor(finalHeight * 1.5)], 
            [finalWidth, finalHeight], 
          ];
          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }
          resolve(currentCanvas.toDataURL('image/png', 2)); 
        };
        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
      console.error('Image enhancement failed:', error);
    }
  }
  cropperReady(event) { }
  loadImageFailed() {
  }
  selectedFile: any;
  imagePreview: any;
  sanitizedFileURL: SafeUrl | null = null;
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; 
    const canvasSize = 200;
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.resetImageUpload();
      return;
    }
    if (file.size > maxFileSize) {
      this.message.error('Service Image size should not exceed 1MB.', '');
      this.resetImageUpload();
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const imgWidth = image.width;
        const imgHeight = image.height;
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          this.message.error('Canvas not supported.', '');
          return;
        }
        let drawWidth = imgWidth;
        let drawHeight = imgHeight;
        let ratio = 1;
        if (imgWidth < 100 && imgHeight < 100) {
          ratio = Math.min(100 / imgWidth, 100 / imgHeight);
        }
        if (imgWidth * ratio > canvasSize || imgHeight * ratio > canvasSize) {
          ratio = Math.min(canvasSize / imgWidth, canvasSize / imgHeight);
        }
        drawWidth = imgWidth * ratio;
        drawHeight = imgHeight * ratio;
        const xOffset = (canvasSize - drawWidth) / 2;
        const yOffset = (canvasSize - drawHeight) / 2;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(image, xOffset, yOffset, drawWidth, drawHeight);
        canvas.toBlob((blob) => {
          if (!blob) {
            this.message.error('Image processing failed.', '');
            return;
          }
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = 'png';
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url = (d ? d : '') + number + '.' + fileExt;
          if (this.data.SERVICE_IMAGE?.trim()) {
            const arr = this.data.SERVICE_IMAGE.split('/');
            if (arr.length > 1) url = arr[5];
          }
          const resizedFile = new File([blob], url, { type: 'image/png' });
          this.selectedFile = resizedFile;
          this.fileURL = resizedFile;
          this.imagePreview = canvas.toDataURL('image/png');
          const uploadedfileExt = this.uploadedImage?.split('.').pop();
          this.UrlImageOne =
            this.data.ID &&
              this.data.SERVICE_IMAGE &&
              uploadedfileExt === fileExt
              ? url
              : url;
          this.timer = this.api
            .onUpload('Item', this.fileURL, this.UrlImageOne)
            .subscribe((res) => {
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImageOne = percentDone;
                if (this.percentImageOne === 100) {
                  this.isSpinning = false;
                  setTimeout(() => (this.progressBarImageOne = false), 2000);
                }
              } else if (res.type === 2 && res.status !== 200) {
                this.message.error('Failed To Upload Service Image...', '');
                this.resetImageUpload();
              } else if (res.type === 4 && res.status === 200) {
                if (res.body?.code === 200) {
                  this.message.success(
                    'Service Image Uploaded Successfully...',
                    ''
                  );
                  this.data.SERVICE_IMAGE = this.UrlImageOne;
                  this.uploadedImage = this.data.SERVICE_IMAGE;
                } else {
                  this.resetImageUpload();
                }
              }
            });
        }, 'image/png');
      };
    };
    reader.readAsDataURL(file);
  }
  resetImageUpload() {
    this.isSpinning = false;
    this.progressBarImageOne = false;
    this.percentImageOne = 0;
    this.data.SERVICE_IMAGE = null;
    this.fileURL = null;
    this.imagePreview = null;
    this.selectedFile = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'Item/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  image1DeleteConfirm(data: any) {
    this.UrlImageOne = null;
    this.data.SERVICE_IMAGE = ' ';
    this.fileURL = null;
  }
  deleteCancel() { }
  removeImage() {
    this.data.URL = ' ';
    this.data.SERVICE_IMAGE = ' ';
    this.fileURL = null;
  }
  ViewImage: any;
  ImageModalVisible = false;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  imageshow;
  expressAvailable(event: any) {
    if (event == true) {
      this.data.EXPRESS_COST = null;
    }
  }
  subServiceAvailable(event: any) {
    if (event == true) {
      this.data.B2B_PRICE = null;
      this.data.B2C_PRICE = null;
      this.data.HSN_CODE = null;
      this.data.TAX_NAME = null;
      this.data.UNIT_NAME = null;
      this.data.HSN_CODE_ID = null;
      this.data.EXPRESS_COST = null;
      this.data.SERVICE_SKILLS = null;
      this.data.UNIT_ID = null;
      this.data.TECHNICIAN_COST = null;
      this.data.VENDOR_COST = null;
      this.data.MAX_QTY = 1;
      this.data.GUARANTEE_PERIOD = null;
      this.data.GUARANTEE_ALLOWED = true;
      this.data.WARRANTY_PERIOD = null;
      this.data.WARRANTY_ALLOWED = true;
      this.data.TAX_ID = null;
      this.data.IS_EXPRESS = false;
      this.data.IS_NEW = true;
      this.data.DURARTION_HOUR = null;
      this.data.DURARTION_MIN = null;
      this.data.PREPARATION_MINUTES == null;
      this.data.PREPARATION_HOURS == null;
      this.data.SERVICE_TYPE = 'O';
      if (this.data.ID) {
        this.data.START_TIME = null;
        this.data.END_TIME = null;
      }
      this.data.QTY = 1;
    }
  }
  restrictMinutes(event: any): void {
    const input = event.target.value;
    if (input > 59) {
      event.target.value = 59; 
      this.data.DURARTION_MIN = 59; 
    } else if (input < 0) {
      event.target.value = ''; 
      this.data.DURARTION_MIN = null;
    } else {
      this.data.DURARTION_MIN = input; 
    }
  }
  restrictMinutes1(event: any): void {
    const input = event.target.value;
    if (input > 59) {
      event.target.value = 59; 
      this.data.PREPARATION_MINUTES = 59; 
    } else if (input < 0) {
      event.target.value = ''; 
      this.data.PREPARATION_MINUTES = null;
    } else {
      this.data.PREPARATION_MINUTES = input; 
    }
  }
  restrictHours(event: any): void {
    const input = event.target.value;
    if (input > 24) {
      event.target.value = 24; 
      this.data.DURARTION_HOUR = 24; 
    } else if (input < 0) {
      event.target.value = ''; 
      this.data.DURARTION_HOUR = null;
    } else {
      this.data.DURARTION_HOUR = input; 
    }
  }
  restrictHours1(event: any): void {
    const input = event.target.value;
    if (input > 24) {
      event.target.value = 24; 
      this.data.PREPARATION_HOURS = 24; 
    } else if (input < 0) {
      event.target.value = ''; 
      this.data.PREPARATION_HOURS = null;
    } else {
      this.data.PREPARATION_HOURS = input; 
    }
  }
  imageshow2: any = null;
  selectedFile2: any;
  imagePreview3: any;
  UrlImageThree;
  fileURL2: any = '';
  ImageModal2Visible: boolean = false;
  progressBarImage: boolean = false;
  percentImage = 0;
  sanitizedLink2: any;
  ViewImage2;
  onDetailsFileSelected(event: any) {
    const maxFileSize = 1 * 1024 * 1024; 
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;
      if (input?.files?.length) {
        this.selectedFile2 = input.files[0];
        if (this.selectedFile2.size > maxFileSize) {
          this.message.error('Service Image size should not exceed 5MB.', '');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview3 = e.target.result; 
          this.fileURL2 = this.selectedFile2;
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileURL2.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = d == null ? '' : d + number + '.' + fileExt;
          if (
            this.data.SERVICE_DETAILS_IMAGE != undefined &&
            this.data.SERVICE_DETAILS_IMAGE.trim() !== ''
          ) {
            var arr = this.data.SERVICE_DETAILS_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          const uploadedfileExt = this.uploadedImage1.split('.').pop();
          if (this.data.ID && this.data.SERVICE_DETAILS_IMAGE) {
            this.UrlImageThree = this.uploadedImage1.split('?')[0];
          } else {
            this.UrlImageThree = url;
          }
          this.timer = this.api
            .onUpload('ServiceDetailsImage', this.fileURL2, this.UrlImageThree)
            .subscribe((res) => {
              this.data.SERVICE_DETAILS_IMAGE = this.UrlImageThree;
              this.uploadedImage1 = this.data.SERVICE_DETAILS_IMAGE;
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImage = percentDone;
                if (this.percentImage == 100) {
                  this.isSpinning = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error(
                  'Failed To Upload Service Details Image...',
                  ''
                );
                this.isSpinning = false;
                this.progressBarImage = false;
                this.percentImage = 0;
                this.data.SERVICE_DETAILS_IMAGE = null;
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] === 200) {
                  this.message.success(
                    'Service Details Image Uploaded Successfully...',
                    ''
                  );
                  this.isSpinning = false;
                  this.data.SERVICE_DETAILS_IMAGE = this.UrlImageThree;
                } else {
                  this.isSpinning = false;
                  this.progressBarImage = false;
                  this.percentImage = 0;
                  this.data.SERVICE_DETAILS_IMAGE = null;
                }
              }
            });
        };
        reader.readAsDataURL(this.selectedFile2);
      }
    } else {
      this.message.error(
        'Please select a valid Icon file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImage = false;
      this.percentImage = 0;
      this.data.SERVICE_DETAILS_IMAGE = null;
    }
  }
  viewDetailsImage(imageURL: string): void {
    this.ViewImage2 = 1;
    this.GetDetailsImage(imageURL);
  }
  GetDetailsImage(link: string) {
    let imagePath2 = this.api.retriveimgUrl + 'ServiceDetailsImage/' + link;
    this.sanitizedLink2 =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath2);
    this.imageshow2 = this.sanitizedLink2;
    this.ImageModal2Visible = true;
  }
  IconDeleteConfirm(data: any) {
    this.UrlImageThree = null;
    this.data.SERVICE_DETAILS_IMAGE = ' ';
    this.data.SERVICE_DETAILS_IMAGE = null;
    this.fileURL2 = null;
  }
  deleteDetailsCancel() { }
  removeDetailsImage() {
    this.data.UrlImageThree = ' ';
    this.fileURL2 = null;
    this.imageshow2 = null;
    this.data.SERVICE_DETAILS_IMAGE = null;
  }
  ImageDeatilsModalCancel() {
    this.ImageModal2Visible = false;
  }
  ImageModal2Cancel() {
    this.ImageModal2Visible = false;
  }
}
