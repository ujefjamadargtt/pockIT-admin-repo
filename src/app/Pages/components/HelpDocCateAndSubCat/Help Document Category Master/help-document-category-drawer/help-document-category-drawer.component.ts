import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { helpDocumentCategory } from 'src/app/Pages/Models/helpdocumentcategory';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-help-document-category-drawer',
  templateUrl: './help-document-category-drawer.component.html',
  styleUrls: ['./help-document-category-drawer.component.css']
})
export class HelpDocumentCategoryDrawerComponent {
  @Input() data: any = helpDocumentCategory;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  isOk = true;
  isFocused: string = '';

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
  ) { }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new helpDocumentCategory();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.HELP_CATEGORY_NAME == null ||
      this.data.HELP_CATEGORY_NAME == undefined ||
      this.data.HELP_CATEGORY_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Help Document Category Name.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          // if (this.data.DESCRIPTION == '') {
          //   this.data.DESCRIPTION = null;
          // }
          this.api.updateHelpDocumentCategoryData(this.data).subscribe((successCode: any) => {
            if (successCode.status == '200') {
              this.message.success('Help Document Category Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Help Document Category Updation Failed', '');
              this.isSpinning = false;
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
        } else {
          this.api.createHelpDocumentCategoryData(this.data).subscribe((successCode: any) => {
            if (successCode.status == '200') {
              this.message.success('Help Document Category Created Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new helpDocumentCategory();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Help Document Category Creation Failed', '');
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
