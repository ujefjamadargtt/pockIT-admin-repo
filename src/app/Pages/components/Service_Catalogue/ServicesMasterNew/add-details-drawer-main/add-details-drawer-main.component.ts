import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-add-details-drawer-main',
  templateUrl: './add-details-drawer-main.component.html',
  styleUrls: ['./add-details-drawer-main.component.css'],
  providers: [DatePipe]
})
export class AddDetailsDrawerMainComponent implements OnInit {
  isSpinning = false;
  isOk = true;
  fileURL: any = "";
  public commonFunction = new CommonFunctionService();

  @Input() dataDesigner: any = ServiceCatMasterDataNew;
  @Input() drawerVisibleDesigner: boolean = false;
  @Input() closeCallbacksubDesigner: any = Function;
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  ngOnInit(): void {
    this.api.getServiceDetailsGetForHTMLContent(this.dataDesigner.ID).subscribe((successCode: any) => {
      if (successCode.code == '200') {
        if (successCode['count'] > 0) {
          this.dataDesigner.FILE_CONTENT = successCode['data'][0]['FILE_CONTENT']
        } else {
          this.dataDesigner.FILE_CONTENT = '';
        }
      } else {
        this.dataDesigner.FILE_CONTENT = '';
      }
    }, (err: HttpErrorResponse) => {
      this.isSpinning = false;
      this.dataDesigner.FILE_CONTENT = '';
    });
  }

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '0',
    maxHeight: '300px',
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
    toolbarHiddenButtons: [['fonts']],
  };

  resetDrawer(ServiceCatmaster: NgForm) {
    this.dataDesigner = new ServiceCatMasterDataNew();
    ServiceCatmaster.form.markAsPristine();
    ServiceCatmaster.form.markAsUntouched();
  }


  save(addNew: boolean, ServiceCatmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.dataDesigner.FILE_CONTENT == '' ||
      this.dataDesigner.FILE_CONTENT == null ||
      this.dataDesigner.FILE_CONTENT == undefined
    ) {
      this.isOk = false;
      this.message.error('Please add details', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        this.api.updateServiceMain(this.dataDesigner).subscribe((successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Service Details Updated Successfully', '');
            if (!addNew) this.closeCallbacksubDesigner();
            this.isSpinning = false;
          } else {
            this.message.error('Service Details Updation Failed', '');
            this.isSpinning = false;
          }
        }, (err: HttpErrorResponse) => {
          this.isSpinning = false;
          if (err.status === 0) {
            this.message.error("Network error: Please check your internet connection.", "");
          } else {
            this.message.error("Something Went Wrong.", "");
          }
        });
      }
    }
  }


  close() {
    this.closeCallbacksubDesigner();
  }
}