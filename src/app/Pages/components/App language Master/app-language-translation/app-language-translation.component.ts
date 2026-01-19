import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-app-language-translation',
  templateUrl: './app-language-translation.component.html',
  styleUrls: ['./app-language-translation.component.css'],
})
export class AppLanguageTranslationComponent {
  @Input() data: any;
  @Input() drawerClose!: () => void;
  ngOnInit() {
    this.getJsondata();
  }
  Traslationlanguage: any[] = [];
  isSpinning = false;
  isSpinning1 = false;
  loadingRecords = false;
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  totalRecords = 1;
  pageIndex = 1;
  close() {
    this.drawerClose();
  }
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  DRAFT_JSON_URL: any;
  array: any = [];
  datalist: any = [];
  datalist2: any = [];
  data1: any[] = [];
  translationData = {};
  getJsondata() {
    if (this.data && this.data.ID) {
      this.loadingRecords = true;
      this.api.getAppLanguageDataFilterwise(this.data.ID).subscribe(
        (data) => {
          if (data['status'] === 200) {
            this.loadingRecords = false;
            this.translationData = data.body['DRAFT_JSON'];
            var defaultJson = data.body['DRAFT_JSON'];
            this.data.NAME =
              data.body.data.length > 0 ? data.body.data[0].NAME : 'English';
            this.datalist = Object.keys(defaultJson).map((key, value) => ({
              KEY: key,
              ENGLISH: defaultJson[value], 
              TRANSLATION: defaultJson[value], 
            }));
            const draftJson2 = data.body['DEAFULT_JSON'] || [];
            this.datalist2 = Object.keys(draftJson2).map((key) => ({
              TRANSLATION: draftJson2[key] || '',
            }));
          } else {
            this.loadingRecords = false;
            this.datalist = [];
            this.message.error('Failed To Load Json Data...', '');
          }
        },
        () => {
          this.loadingRecords = false;
          this.message.error('Something went wrong.', '');
        }
      );
    }
  }
  TRANSLATION: any;
  getKeys(obj: any) {
    return obj ? Object.keys(obj) : [];
  }
  resetDrawer(LanguageDrawer: NgForm) {
    this.data;
    LanguageDrawer.form.markAsPristine();
    LanguageDrawer.form.markAsUntouched();
  }
  isOk = true;
  save(addNew: boolean, LanguageDrawer: NgForm): void {
    const payload = {
      LANGUAGE_ID: this.data.ID,
      LANGUAGE: this.data.NAME,
      DRAFT_JSON_URL: this.data.DRAFT_JSON_URL,
      DRAFT_JSON: this.translationData,
    };
    this.loadingRecords = true;
    this.api.createTranslationLanguageData(payload).subscribe(
      (successCode: any) => {
        if (successCode.message) {
          this.loadingRecords = false;
          this.message.success(
            'Language Translation data saved in draft successfully.',
            ''
          );
          if (!addNew) {
            this.drawerClose();
          } else {
            this.resetDrawer(LanguageDrawer);
          }
          this.loadingRecords = false;
        } else {
          this.message.error('Failed to save language data in draft.', '');
          this.loadingRecords = false;
        }
      },
      () => {
        this.message.error('Something went wrong.', '');
        this.loadingRecords = false;
      }
    );
  }
  save1(addNew: boolean, LanguageDrawer: NgForm): void {
    this.isOk = true;
    if (
      this.datalist.some(
        (data1: any) =>
          !this.translationData[data1.KEY] ||
          this.translationData[data1.KEY].trim() === ''
      )
    ) {
      this.isOk = false;
      this.message.error('Please fill all required fields in every record.', '');
      return;
    }
    if (this.isOk) {
      this.loadingRecords = true;
      const payload = {
        LANGUAGE_ID: this.data.ID,
        LANGUAGE: this.data.NAME,
        DRAFT_JSON_URL: this.data.DRAFT_JSON_URL,
        DRAFT_JSON: this.translationData,
      };
      this.api.SaveTranslationLanguageData(payload).subscribe(
        (successCode: any) => {
          if (successCode.message) {
            this.message.success(
              'Language Translation data saved successfully.',
              ''
            );
            this.loadingRecords = false;
            if (!addNew) {
              this.drawerClose();
            } else {
              this.resetDrawer(LanguageDrawer);
            }
            this.loadingRecords = false;
          } else {
            this.message.error('Failed to save language data ', '');
            this.loadingRecords = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
          this.loadingRecords = false;
        }
      );
    }
  }
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  updateTranslations(value: string) {
    Object.keys(this.translationData).forEach(key => {
      this.translationData[key] = value;
    });
  }
}
