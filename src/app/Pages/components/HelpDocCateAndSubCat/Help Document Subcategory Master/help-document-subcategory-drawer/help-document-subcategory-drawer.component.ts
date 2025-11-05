import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { helpDocumentSubcategory } from 'src/app/Pages/Models/helpDocumentSubcategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-help-document-subcategory-drawer',
  templateUrl: './help-document-subcategory-drawer.component.html',
  styleUrls: ['./help-document-subcategory-drawer.component.css']
})
export class HelpDocumentSubcategoryDrawerComponent {
  @Input() data: any = helpDocumentSubcategory;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  isFocused: string = '';
  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  isOk = true;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
  ) { }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new helpDocumentSubcategory();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  ngOnInit() {
    this.getcategoryData();
  }
  CategoryData: any = [];
  getcategoryData() {
    this.api.getHelpDocumentCategoryData(0, 0, "", "", " AND IS_ACTIVE=1").subscribe(
      (data) => {
        if (data["status"] == 200) {
          this.CategoryData = data['body']["data"];
        } else {
          this.CategoryData = [];
          this.message.error("Failed To Get Help Document Category Data", "");
        }
      },
      () => {
        this.message.error("Something Went Wrong", "");
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
      (this.data.CATEGORY_ID == undefined ||
        this.data.CATEGORY_ID == null ||
        this.data.CATEGORY_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    }
    else if (
      this.data.CATEGORY_ID == null ||
      this.data.CATEGORY_ID == undefined ||
      this.data.CATEGORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Help Document Category Name.', '');
    }
    else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Help Document Subcategory Name.', '');
    }


    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          // if (this.data.DESCRIPTION == '') {
          //   this.data.DESCRIPTION = null;
          // }
          this.api.updateHelpDocumentSubategoryData(this.data).subscribe((successCode: any) => {
            if (successCode.status == '200') {
              this.message.success('Help Document Subcategory Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Help Document Subcategory Updation Failed', '');
              this.isSpinning = false;
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
          );
        } else {
          this.api.createHelpDocumentSubategoryData(this.data).subscribe((successCode: any) => {
            if (successCode.status == '200') {
              this.message.success('Help Document Subcategory Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new helpDocumentSubcategory();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Help Document Subcategory Creation Failed', '');
              this.isSpinning = false;
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
        }
      }
    }
  }

  close() {
    this.drawerClose();
  }
}
