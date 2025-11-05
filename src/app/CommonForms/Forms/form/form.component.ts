import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormMaster } from 'src/app/CommonModels/form-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: FormMaster = new FormMaster();
  isSpinning = false;
  forms: FormMaster[] = [];
  isFocused: string = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    this.isSpinning = true;
    let filterQuery = ' and PARENT_ID=0';

    this.api.getAllForms(0, 0, '', '', filterQuery).subscribe(
      (forms) => {
        this.forms = forms['data'];
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }

  close(): void {
    this.drawerClose();
  }
  isOk = true;
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true; // Assuming isOk is used for overall validation status

    // Check if all required fields are filled
    if (
      (this.data.NAME == null ||
        this.data.NAME == undefined ||
        this.data.NAME.trim() == '') &&
      (this.data.LINK == null ||
        this.data.LINK == undefined ||
        this.data.LINK.trim() == '') &&
      (this.data.ICON == null ||
        this.data.ICON == undefined ||
        this.data.ICON.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
      this.isSpinning = false;

      return;
    }

    // Further validation specifically for NAME
    if (!this.data.NAME?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Name', '');
      this.isSpinning = false;
      return;
    } else if (!this.data.LINK?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Link', '');
      this.isSpinning = false;
    } else if (!this.data.ICON?.trim()) {
      this.isOk = false;
      this.message.error('Please Enter a Icon', '');
      this.isSpinning = false;
    }

    // Proceed with save operation
    if (this.isOk) {
      if (this.data.ID) {
        this.api.updateForm(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Form Updated Successfully...', '');
              if (!addNew) this.drawerClose();
            } else {
              this.message.error('Form Updation Failed...', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong ...', '');
          }
        );
      } else {
        this.api.createForm(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Form Created Successfully...', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new FormMaster();
                this.resetDrawer(websitebannerPage);
              }

              this.loadForms();
            } else {
              this.message.error('Form Creation Failed...', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong ...', '');
          }
        );
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new FormMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
