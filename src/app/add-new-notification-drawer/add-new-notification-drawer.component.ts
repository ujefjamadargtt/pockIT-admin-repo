import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from '../Service/api-service.service';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from '../app.constant';
import { CommonFunctionService } from '../Service/CommonFunctionService';
import { PDFDocument } from 'pdf-lib';
@Component({
  selector: 'app-add-new-notification-drawer',
  templateUrl: './add-new-notification-drawer.component.html',
  styleUrls: ['./add-new-notification-drawer.component.css'],
})
export class AddNewNotificationDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  sharingMode = '1';
  notificationType = 'C';
  USER_IDS: any = [];
  TITLE: string = '';
  DESCRIPTION: string = '';
  employeeList: any = [];
  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));
  heading = 'Select Customers';
  individualGrid = false;
  deptGrid = false;
  branchGrid = false;
  designationGrid = false;
  entireOrg = false;
  isSpinning = false;
  loadingList: boolean = false;
  percentImageOne: number;
  progressBarImageOne: boolean;
  hidePincode: boolean = false; 
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private cookie: CookieService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.changeRadioButton('1');
    this.getCountyData();
  }
  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, '', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.countryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  StateData: any = [];
  getStatesByCountry(countryId: any, value: boolean) {
    if (value == true) {
      this.StateData = [];
    }
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
          } else {
            this.StateData = [];
            this.message.error('Failed to get state data.', '');
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }
  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }
  btnIndividualStatus = false;
  btnDepartmentStatus = false;
  btnBranchStatus = false;
  btnDesignationStatus = false;
  btnEntireOrganisationStatus = false;
  disableRadioButtons() {
    if (this.roleId == 12) {
      this.btnIndividualStatus = true;
      this.btnDepartmentStatus = true;
      this.btnBranchStatus = true;
      this.btnDesignationStatus = true;
      this.btnEntireOrganisationStatus = true;
    } else {
      this.btnIndividualStatus = true;
      this.btnDepartmentStatus = false;
      this.btnBranchStatus = false;
      this.btnDesignationStatus = false;
      this.btnEntireOrganisationStatus = false;
      if (this.deptId == 0) {
        this.btnDepartmentStatus = true;
      }
      if (this.designationId == 0) {
        this.btnDesignationStatus = true;
      }
      if (this.branchId == 0) {
        this.btnBranchStatus = true;
      }
    }
  }
  pageIndex = 1;
  pageSize = 10;
  PincodeData: any = [];
  selectedPincode: any;
  changeRadioButton(btnValue) {
    this.radiogroup = '';
    this.radiogroup1 = 'ALL';
    this.USER_IDS = [];
    this.employeeList = [];
    this.SELECT_ALL = false;
    if (btnValue == '1') {
      this.heading = 'Select Vendor';
      this.api.getVendorData(0, 0, '', 'desc', ' AND STATUS=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingList = false;
            this.employeeList = data['data'];
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
    } else if (btnValue == '2') {
      this.heading = 'Select Backoffice Members';
      this.api.getBackOfficeData(0, 0, '', 'desc', '').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingList = false;
            this.employeeList = data['data'];
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
    } else if (btnValue == '3') {
      this.heading = 'Select Customers';
      this.api
        .getAllCustomer(0, 0, '', 'desc', ' AND ACCOUNT_STATUS=1')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.employeeList = data['data'];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else if (btnValue == '4') {
      this.heading = 'Select Technicians';
      this.api
        .getTechnicianData(0, 0, '', 'desc', ' AND TECHNICIAN_STATUS=1')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.employeeList = data['data'];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else if (btnValue == '5') {
      this.heading = 'Select Pincode';
      this.notificationType = 'T';
      this.api
        .getAllPincode(
          this.pageIndex,
          this.pageSize,
          '',
          'desc',
          ' AND IS_ACTIVE=1'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.PincodeData = data['data'];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else if (btnValue == '6') {
      this.heading = '';
      this.notificationType = 'T';
    }
  }
  searchTextPincode = '';
  searchAllPincodes(searchText) {
    this.loadingList = true;
    if (searchText && searchText?.length > 3) {
      this.searchTextPincode = searchText;
      this.api
        .getAllPincode(
          0,
          0,
          '',
          'desc',
          ` AND IS_ACTIVE=1 AND PINCODE_NUMBER LIKE '%${searchText}%'`
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.PincodeData = [
                ...new Map(
                  [...this.PincodeData, ...data['data']].map((item) => [
                    item.PINCODE_NUMBER,
                    item,
                  ])
                ).values(),
              ];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.loadingList = false;
          }
        );
    }
  }
  loadMore(): void {
    if (this.sharingMode == '5') {
      this.loadingList = true;
      this.pageSize += 10;
      var query = '';
      if (this.searchTextPincode) {
        query = ` AND PINCODE_NUMBER LIKE '%${this.searchTextPincode}%'`;
      }
      this.api
        .getAllPincode(
          this.pageIndex,
          this.pageSize,
          '',
          'desc',
          ' AND IS_ACTIVE=1' + query
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.PincodeData = [
                ...new Map(
                  [...this.PincodeData, ...data['data']].map((item) => [
                    item.PINCODE_NUMBER,
                    item,
                  ])
                ).values(),
              ];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  selectedFileName: any = '';
  urlImageOne;
  imgUrl = appkeys.retriveimgUrl;
  clearImage() {
    this.selectedFileName = null;
  }
  onCancel() {
    this.selectedFileName = null;
    this.progressBarImageOne = false;
    this.isVisibleMiddle = false;
    this.myElementRef.nativeElement.value = null;
  }
  isVisibleMiddle = false;
  async reduceFileSize(file: File, targetSizeMB: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        let data = event.target.result as string;
        const maxSizeBytes = targetSizeMB * 1024 * 1024;
        if (data.length > maxSizeBytes) {
          data = data.slice(0, maxSizeBytes);
        }
        const compressedBlob = new Blob([data], { type: file.type });
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
        });
        resolve(compressedFile);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
  async compressImage(file: File, targetSizeMB: number): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleFactor = Math.sqrt((targetSizeMB * 1024 * 1024) / file.size);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
            });
            resolve(compressedFile);
          },
          file.type,
          0.6 
        );
      };
      reader.readAsDataURL(file);
    });
  }
  async compressTextFile(file: File): Promise<File> {
    const text = await file.text();
    const compressedText = text.replace(/\s+/g, ' ').trim(); 
    const compressedFile = new File([compressedText], file.name, {
      type: file.type,
    });
    return compressedFile;
  }
  pdfSrc: string | ArrayBuffer = '';
  isFocused = '';
  @ViewChild('image1') myElementRef!: ElementRef;
  async compressPdf(file: File) {
    const arrayBuffer: any = await file.arrayBuffer();
    const pdfDoc: any = await PDFDocument.load(arrayBuffer);
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    const compressedPdfBytes: any = await pdfDoc.save();
    return new Blob([compressedPdfBytes], { type: 'application/pdf' });
  }
  showConfirm(): void {
    this.isSpinning = true;
    if (this.referenceForFile.type.startsWith('image/')) {
      this.compressImage(this.referenceForFile, 1).then((compressedFile) => {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = compressedFile.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload('notificationAttachment', compressedFile, this.urlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.isVisibleMiddle = false;
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      });
    } else if (this.referenceForFile.type === 'application/pdf') {
      this.compressPdf(this.referenceForFile).then((compressedFile) => {
        const number = Math.floor(100000 + Math.random() * 900000);
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${'pdf'}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload('notificationAttachment', compressedFile, this.urlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.isVisibleMiddle = false;
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      });
    } else if (this.referenceForFile.type.startsWith('text/')) {
      this.compressTextFile(this.referenceForFile).then((compressedFile) => {
        this.isVisibleMiddle = false;
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = compressedFile.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload('notificationAttachment', compressedFile, this.urlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Successfully Uploaded Attachment', '');
                this.isVisibleMiddle = false;
                this.isSpinning = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      });
    } else {
      const fileExtension = this.referenceForFile.name
        .split('.')
        .pop()
        ?.toLowerCase();
      if (['mp3', 'mp4'].includes(fileExtension)) {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = this.referenceForFile.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload(
            'notificationAttachment',
            this.referenceForFile,
            this.urlImageOne
          )
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
                this.isVisibleMiddle = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      } else {
        this.reduceFileSize(this.referenceForFile, 1).then((compressedFile) => {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = compressedFile.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
          this.selectedFileName = this.urlImageOne;
          this.api
            .onUpload(
              'notificationAttachment',
              compressedFile,
              this.urlImageOne
            )
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentImageOne = percentDone;
                if (this.percentImageOne == 100) {
                  this.isSpinning = false;
                  this.progressBarImageOne = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Attachment...', '');
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Successfully Uploaded Attachment', '');
                  this.isSpinning = false;
                  this.selectedFileName = this.urlImageOne;
                  this.progressBarImageOne = false;
                  this.isVisibleMiddle = false;
                } else {
                  this.isSpinning = false;
                  this.progressBarImageOne = false;
                  this.percentImageOne = 0;
                  this.selectedFileName = null;
                }
              }
            });
        });
      }
    }
  }
  referenceForFile;
  MEDIA_TYPE = '';
  onFileSelected(event: any) {
    this.isSpinning = true;
    this.referenceForFile = event.target.files[0];
    if (event) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      if (!fileExtension) {
        this.message.error('Invalid file selected', '');
        this.isSpinning = false;
        return;
      }
      const videoExtensions = ['mp4', 'avi'];
      const imageExtensions = ['jpg', 'jpeg', 'png'];
      const audioExtensions = ['mp3'];
      const documentExtensions = ['pdf', 'docx', 'txt'];
      if (this.MEDIA_TYPE === 'V' && !videoExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid video (mp4, avi)', '');
        event.target.value = null;
        this.isSpinning = false;
        return;
      }
      if (this.MEDIA_TYPE === 'I' && !imageExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid image (jpg, jpeg, png)', '');
        this.isSpinning = false;
        event.target.value = null;
        return;
      }
      if (this.MEDIA_TYPE === 'A' && !audioExtensions.includes(fileExtension)) {
        this.message.error('Please upload a valid audio file (mp3)', '');
        this.isSpinning = false;
        event.target.value = null;
        return;
      }
      if (
        this.MEDIA_TYPE === 'T' &&
        !documentExtensions.includes(fileExtension)
      ) {
        this.message.error(
          'Please upload a valid document (pdf, docx, txt)',
          ''
        );
        this.isSpinning = false;
        event.target.value = null;
        return;
      }
      this.isSpinning = true;
    }
    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'pdf',
      'docx',
      'txt',
      'mp3',
      'mp4',
      'avi',
    ];
    const file = event.target.files[0]; 
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.message.error(
          'Invalid file type! Please select a valid file.',
          ''
        );
        this.isSpinning = false;
        event.target.value = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.isSpinning = false;
        this.message.info('File size should not exceed 10MB!', '');
        event.target.value = null;
        return;
      } else if (file.size > 1 * 1024 * 1024 && file.size < 10 * 1024 * 1024) {
        this.isVisibleMiddle = true;
        this.isSpinning = false;
      } else {
        const number = Math.floor(100000 + Math.random() * 900000);
        const fileExt = file.name.split('.').pop();
        const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        this.urlImageOne = `${d ?? ''}${number}.${fileExt}`;
        this.selectedFileName = this.urlImageOne;
        this.api
          .onUpload('notificationAttachment', file, this.urlImageOne)
          .subscribe((res) => {
            if (res.type === HttpEventType.Response) {
            }
            if (res.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round((100 * res.loaded) / res.total);
              this.percentImageOne = percentDone;
              if (this.percentImageOne == 100) {
                this.isSpinning = false;
                this.progressBarImageOne = false;
              }
            } else if (res.type == 2 && res.status != 200) {
              this.message.error('Failed To Upload Attachment...', '');
              this.isSpinning = false;
              this.progressBarImageOne = false;
              this.percentImageOne = 0;
              this.selectedFileName = null;
            } else if (res.type == 4 && res.status == 200) {
              if (res.body['code'] == 200) {
                this.message.success('Successfully Uploaded Attachment', '');
                this.isSpinning = false;
                this.selectedFileName = this.urlImageOne;
                this.progressBarImageOne = false;
              } else {
                this.isSpinning = false;
                this.progressBarImageOne = false;
                this.percentImageOne = 0;
                this.selectedFileName = null;
              }
            }
          });
      }
    }
  }
  getInitial(empName) {
    let initial: string = empName?.charAt(0);
    return initial?.trim();
  }
  topicName;
  selectedCountyId;
  selectedStateId;
  onNotificationTypeChange(eve) {
    this.hidePincode = false
  }
  onTechnicianWiseChange(event) {
    if (event) {
      this.api
        .getTechnicianData(
          0,
          0,
          '',
          'desc',
          ' AND TECHNICIAN_STATUS=1 AND TYPE=' + `'${event}'`
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingList = false;
              this.employeeList = data['data'];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  isPincodeSpinning = false;
  PincodeData2: any = [];
  searchTextPincode2 = '';
  selectedPincode2;
  searchAllPincodes2(searchText2) {
    this.isPincodeSpinning = true;
    if (searchText2 && searchText2?.length > 3) {
      this.searchTextPincode2 = searchText2;
      this.api
        .getAllPincode(
          0,
          0,
          '',
          'desc',
          ` AND IS_ACTIVE=1 AND STATE=${this.selectedStateId} AND PINCODE_NUMBER LIKE '%${searchText2}%'`
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.isPincodeSpinning = false;
              this.PincodeData2 = [
                ...new Map(
                  [...this.PincodeData2, ...data['data']].map((item) => [
                    item.PINCODE_NUMBER,
                    item,
                  ])
                ).values(),
              ];
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
            this.isPincodeSpinning = false;
          }
        );
    }
  }
  loadMore2(): void {
    this.loadingList = true;
    this.pageSize += 10;
    var query = '';
    if (this.searchTextPincode2) {
      query = ` AND PINCODE_NUMBER LIKE '%${this.searchTextPincode2}%'`;
    }
    this.api
      .getAllPincode(
        this.pageIndex,
        this.pageSize,
        '',
        'desc',
        ' AND IS_ACTIVE=1' + ' AND STATE=' + this.selectedStateId + query
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingList = false;
            this.PincodeData2 = [
              ...new Map(
                [...this.PincodeData2, ...data['data']].map((item) => [
                  item.PINCODE_NUMBER,
                  item,
                ])
              ).values(),
            ];
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
  }
  getPincodesByCity(districtId: number) {
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(
        this.pageIndex,
        this.pageSize,
        '',
        'desc',
        ` AND IS_ACTIVE = 1 AND STATE=${districtId} `
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData2 = data['data'];
          } else {
            this.PincodeData2 = [];
            this.message.error('Failed To Get Pincode Data...', '');
          }
          this.isPincodeSpinning = false; 
        },
        () => {
          this.message.error('Something went wrong.', '');
          this.isPincodeSpinning = false; 
        }
      );
  }
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, myForm: NgForm): void {
    let isOk = true;
    this.isSpinning = true;
    if (
      this.radiogroup == 'P' &&
      !this.selectedCountyId &&
      !this.selectedStateId
    ) {
      this.message.error('Please select country and state', '');
      this.isSpinning = false;
      return;
    } else if (
      this.radiogroup == 'P' &&
      this.selectedCountyId &&
      !this.selectedStateId
    ) {
      this.topicName = `promotion_country_${this.selectedCountyId}_channel`;
    } else if (
      this.radiogroup == 'P' &&
      this.selectedCountyId &&
      this.selectedStateId &&
      !this.selectedPincode2
    ) {
      this.topicName = `promotion_state_${this.selectedStateId}_channel`;
    } else if (
      this.radiogroup == 'P' &&
      this.selectedCountyId &&
      this.selectedStateId &&
      this.selectedPincode2
    ) {
      this.topicName = `promotion_pincode_${this.selectedPincode2}_channel`;
    } else if (
      !this.entireOrg &&
      this.USER_IDS.length == 0 &&
      !this.selectedPincode &&
      this.sharingMode !== '6'
    ) {
      isOk = false;
      let messageMap = {
        '1': 'Please Select Vendors',
        '2': 'Please Select Back Office Members',
        '3': 'Please Select Customers',
        '4': 'Please Select Technicians',
        '5': 'Please Select Pincode',
      };
      this.isSpinning = false;
      this.message.error(
        messageMap[this.sharingMode] || 'Please Select a User',
        ''
      );
    }
    else if (!this.TITLE?.trim()) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Valid Notification Title', '');
    } else if (!this.api.checkTextBoxIsValid(this.TITLE)) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Invalid characters in Title', '');
    }
    else if (!this.DESCRIPTION?.trim()) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Valid Notification Description', '');
    } else if (this.MEDIA_TYPE?.trim() !== '' && !this.selectedFileName) {
      isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Valid Attachment', '');
    }
    if (isOk) {
      if (this.notificationType == 'T' && this.sharingMode == '1') {
        this.topicName = 'vendor_channel';
        this.USER_IDS = [];
      }
      if (this.notificationType == 'T' && this.sharingMode == '2') {
        this.topicName = 'backoffice_channel';
        this.USER_IDS = [];
      }
      if (this.notificationType == 'T' && this.sharingMode == '3') {
        if (this.radiogroup == 'S') {
          (this.topicName = 'customer_channel'), (this.USER_IDS = []);
        }
      }
      if (this.notificationType == 'T' && this.sharingMode == '6') {
        this.topicName = 'system_alerts_channel';
        this.USER_IDS = [];
      }
      if (
        this.notificationType == 'T' &&
        this.sharingMode == '4' &&
        this.radiogroup1 == 'ALL'
      ) {
        this.topicName = 'technician_channel';
        this.USER_IDS = [];
      }
      if (
        this.notificationType == 'T' &&
        this.sharingMode == '4' &&
        this.radiogroup1 == 'F'
      ) {
        this.topicName = 'freelancer_channel';
        this.USER_IDS = [];
      }
      if (
        this.notificationType == 'T' &&
        this.sharingMode == '4' &&
        this.radiogroup1 == 'V'
      ) {
        this.topicName = 'vendor_managed_channel';
        this.USER_IDS = [];
      }
      if (
        this.notificationType == 'T' &&
        this.sharingMode == '4' &&
        this.radiogroup1 == 'O'
      ) {
        this.topicName = 'on_payroll_channel';
        this.USER_IDS = [];
      }
      if (this.sharingMode == '5' && !this.selectedPincode) {
        this.message.error('Select Pincode', '');
        this.isSpinning = false;
      }
      if (this.sharingMode == '5' && this.selectedPincode) {
        this.topicName = `pincode_${this.selectedPincode}_channel`;
        this.USER_IDS = [];
      }
      let type =
        this.sharingMode == '1'
          ? 'V'
          : this.sharingMode == '2'
            ? 'B'
            : this.sharingMode == '3'
              ? 'C'
              : this.sharingMode == '4'
                ? 'T'
                : this.sharingMode == '5'
                  ? 'P'
                  : this.sharingMode == '6'
                    ? 'S'
                    : '';
      this.isSpinning = true;
      let rawUserId = sessionStorage.getItem('userId');
      let userId = rawUserId
        ? Number(this.commonFunction.decryptdata(rawUserId))
        : null;
      this.api
        .notiDetailsAddBulk(
          this.TITLE,
          this.DESCRIPTION,
          Number(this.sharingMode),
          this.USER_IDS,
          this.orgId,
          type,
          this.selectedFileName,
          this.MEDIA_TYPE,
          userId,
          this.radiogroup == 'P' ? 'T' : this.notificationType,
          this.topicName
        )
        .subscribe(
          (successCode) => {
            this.isSpinning = false;
            if (successCode['status'] === 200) {
              this.message.success('Notifications Pushed Successfully', '');
              this.changeRadioButton(this.sharingMode);
              this.close(myForm);
            } else {
              this.message.error('Failed to Push Notifications', '');
            }
          },
          (err) => {
            this.isSpinning = false;
            this.message.error('Failed to Push Notifications', '');
          }
        );
    }
  }
  SELECT_ALL: boolean = false;
  radiogroup = '';
  radiogroup1: any = 'ALL';
  onSelectAllChecked(switchStatus: boolean) {
    let ids: any = [];
    if (switchStatus == true) {
      if (this.sharingMode != '1' && this.sharingMode != '2') {
        for (let i = 0; i < this.employeeList.length; i++) {
          ids.push(this.employeeList[i]['ID']);
        }
      } else {
        for (let i = 0; i < this.employeeList.length; i++) {
          ids.push(this.employeeList[i]['USER_ID']);
        }
      }
      this.notificationType = 'T';
    } else {
      ids = [];
      this.notificationType = 'C';
    }
    this.USER_IDS = ids;
  }
}