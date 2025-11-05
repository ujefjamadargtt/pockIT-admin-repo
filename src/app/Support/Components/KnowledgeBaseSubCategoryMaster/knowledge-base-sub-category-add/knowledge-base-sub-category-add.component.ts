import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { KnowledgeBaseSubCategory } from 'src/app/Support/Models/KnowledgeBaseSubCategory';

@Component({
  selector: 'app-knowledge-base-sub-category-add',
  templateUrl: './knowledge-base-sub-category-add.component.html',
  styleUrls: ['./knowledge-base-sub-category-add.component.css'],
})
export class KnowledgeBaseSubCategoryAddComponent {
  @Input() data: any = KnowledgeBaseSubCategory;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  isFocused: string = '';
  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  isOk = true;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new KnowledgeBaseSubCategory();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  ngOnInit() {
    this.getcategoryData();
  }
  CategoryData: any = [];
  getcategoryData() {
    this.api
      .getKnowledgeBaseCategoryData(0, 0, '', '', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data: HttpResponse<any>) => {
          // 

          const statusCode = data.status;
          const responseBody = data.body;
          if (statusCode == 200) {
            this.CategoryData = responseBody['data'];
          } else {
            this.CategoryData = [];
            this.message.error(
              'Failed To Get Knowledge Base Category Data',
              ''
            );
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.data.NAME == ' ' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.KNOWLEDGEBASE_CATEGORY_ID == undefined ||
        this.data.KNOWLEDGEBASE_CATEGORY_ID == null ||
        this.data.KNOWLEDGEBASE_CATEGORY_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.KNOWLEDGEBASE_CATEGORY_ID == null ||
      this.data.KNOWLEDGEBASE_CATEGORY_ID == undefined ||
      this.data.KNOWLEDGEBASE_CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Category.', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Subcategory Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          if (this.data.DESCRIPTION == '') {
            this.data.DESCRIPTION = null;
          }
          this.api.updateKnowledgeBasesubCategoryData(this.data).subscribe(
            (successCode: HttpResponse<any>) => {
              // (data: HttpResponse<any>) => {
              // 

              const statusCode = successCode.status;
              if (statusCode == 200) {
                this.message.success(
                  'Knowledge Base Subcategory Updated Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error(
                  'Knowledge Base Subcategory Updation Failed',
                  ''
                );
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
          this.api.createKnowledgeBasesubCategoryData(this.data).subscribe(
            (successCode: HttpResponse<any>) => {
              // (data: HttpResponse<any>) => {
              // 

              const statusCode = successCode.status;
              if (statusCode == 200) {
                this.message.success(
                  'Knowledge Base Subcategory Created Successfully',
                  ''
                );
                if (!addNew) this.drawerClose();
                else {
                  this.data = new KnowledgeBaseSubCategory();
                  this.resetDrawer(websitebannerPage);
                }
                this.isSpinning = false;
              } else {
                this.message.error(
                  ' Knowledge Base Subcategory Creation Failed',
                  ''
                );
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

  close() {
    this.drawerClose();
  }
}
