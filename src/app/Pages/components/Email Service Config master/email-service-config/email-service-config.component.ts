import { DatePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { emailserviceconfig } from 'src/app/Pages/Models/emailserviceconfig';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-email-service-config',
  templateUrl: './email-service-config.component.html',
  styleUrls: ['./email-service-config.component.css'],
})
export class EmailServiceConfigComponent {
  @Input() data: emailserviceconfig;
  @Input() drawerClose: any;
  @Input() drawerVisible: boolean;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  service_provider = '^[a-zA-Z\s/()\-_.&]+$'
  isSpinning: boolean = false;
  close() {
    this.drawerClose();
  }
  emailPattern: RegExp = /^(?!.*\.\..*)(?!.*--.*)(?!.*-\.|-\@|\.-|\@-)[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,}$/;
  isFocused: string = '';
  resetDrawer(CategoryDrawer: NgForm) {
    this.data = new emailserviceconfig();
    CategoryDrawer.form.markAsPristine();
    CategoryDrawer.form.markAsUntouched();
  }
  TIMEOUT_DATE: any;
  ngOnInit() {
    const timeoutSeconds = this.data.TIMEOUT_SECONDS || 0;
    this.TIMEOUT_DATE = new Date(1970, 0, 1, 0, 0, timeoutSeconds);
  }
  onTimeChange(value: Date): void {
    if (value instanceof Date && !isNaN(value.getTime())) {
      this.data.TIMEOUT_SECONDS = value.getSeconds();
    } else {
      this.message.error('Invalid time selected.', '');
    }
  }
  public commonFunction = new CommonFunctionService();
  save(addNew: boolean, emailDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.SERVICE_PROVIDER == null ||
        this.data.SERVICE_PROVIDER == undefined ||
        this.data.SERVICE_PROVIDER.trim() == '') &&
      (this.data.ENCRYPTION_TYPE == null ||
        this.data.ENCRYPTION_TYPE == undefined ||
        this.data.ENCRYPTION_TYPE.trim() == '') &&
      (this.data.AUTHENTICATION_TYPE == null ||
        this.data.AUTHENTICATION_TYPE == undefined ||
        this.data.AUTHENTICATION_TYPE.trim() == '') &&
      (this.data.SMTP_HOST == null ||
        this.data.SMTP_HOST == undefined ||
        this.data.SMTP_HOST.trim() == '') &&
      (this.data.SMTP_PORT == null ||
        this.data.SMTP_PORT == undefined ||
        this.data.SMTP_PORT.trim() == '') &&
      (this.data.USERNAME == null ||
        this.data.USERNAME == undefined ||
        this.data.USERNAME.trim() == '') &&
      (this.data.PASSWORD == null ||
        this.data.PASSWORD == undefined ||
        this.data.PASSWORD.trim() == '') &&
      (this.data.SENDER_NAME == null ||
        this.data.SENDER_NAME == undefined ||
        this.data.SENDER_NAME.trim() == '') &&
      (this.data.SENDER_EMAIL == null ||
        this.data.SENDER_EMAIL == undefined ||
        this.data.SENDER_EMAIL.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields ', '');
    } else if (!this.data.SERVICE_PROVIDER?.trim()) {
      this.isOk = false;
      this.message.error('Please enter service provider.', '');
    } else if (!this.data.ENCRYPTION_TYPE?.trim()) {
      this.isOk = false;
      this.message.error('Please select encryption type.', '');
    } else if (!this.data.AUTHENTICATION_TYPE?.trim()) {
      this.isOk = false;
      this.message.error('Please select authentication type.', '');
    } else if (!this.data.SMTP_HOST?.trim()) {
      this.isOk = false;
      this.message.error('Please enter SMTP host.', '');
    }
    else if (!this.validateSMTPHost()) {
      this.isOk = false;
      this.message.error('Invalid SMTP host format.', '');
    }
    else if (!this.data.SMTP_PORT?.trim()) {
      this.isOk = false;
      this.message.error('Please enter SMTP port.', '');
    } else if (!this.data.USERNAME?.trim()) {
      this.isOk = false;
      this.message.error('Please enter user name.', '');
    }
    else if (!this.emailPattern.test(this.data.USERNAME.trim())) {
      this.isOk = false;
      this.message.error('Please enter a valid user name.', '');
    }
    else if (!this.data.PASSWORD?.trim()) {
      this.isOk = false;
      this.message.error('Please enter password.', '');
    } else if (this.data.PASSWORD?.trim().length < 7) {
      this.isOk = false;
      this.message.error('Password must be at least 8 characters long.', '');
    } else if (!this.data.SENDER_NAME?.trim()) {
      this.isOk = false;
      this.message.error('Please enter sender name.', '');
    } else if (
      this.data.SENDER_EMAIL == null ||
      this.data.SENDER_EMAIL == undefined ||
      this.data.SENDER_EMAIL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please enter sender email.', '');
    } else if (!this.emailPattern.test(this.data.SENDER_EMAIL.trim())) {
      this.isOk = false;
      this.message.error('Please enter a valid sender email.', '');
    }
    if (this.TIMEOUT_DATE instanceof Date && !isNaN(this.TIMEOUT_DATE.getTime())) {
      this.data.TIMEOUT_SECONDS = Number(
        this.datePipe.transform(this.TIMEOUT_DATE, 'ss')
      );
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api
          .updateemailServiceConfigData(this.data)
          .subscribe((response: any) => {
            this.isSpinning = false;
            if (response.code == 300 && response.message == 'Sender_email and username already exist.') {
              this.message.error('User Name and sender email already exist', '')
            }
            else if (response.code == 300 && response.message == 'User Name already exists.') {
              this.message.error('User Name already exist', '')
            }
            else if (response.code == 300 && response.message == 'Sender_email already exists.') {
              this.message.error('Sender name already exist', '')
            }
            else if (response.code === 200) {
              this.message.success(
                'Email service configuration data updated successfully.',
                ''
              );
              if (!addNew) this.drawerClose();
            } else {
              this.message.error(
                'Failed to update email service configuration data.',
                ''
              );
            }
          }, (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          });
      } else {
        this.api
          .CreateemailServiceConfigData(this.data)
          .subscribe((response: any) => {
            this.isSpinning = false;
            if (response.code == 300 && response.message == 'Sender_email and username already exist.') {
              this.message.error('User Name and sender email already exist', '')
            }
            else if (response.code == 300 && response.message == 'User Name already exists.') {
              this.message.error('User Name already exist', '')
            }
            else if (response.code == 300 && response.message == 'Sender_email already exists.') {
              this.message.error('Sender name already exist', '')
            }
            else if (response.code === 200) {
              this.message.success(
                'Email service configuration data created successfully.',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.resetDrawer(emailDrawer);
                this.api
                  .getemailServiceConfigData(0, 0, '', 'desc', '')
                  .subscribe(
                    () => { },
                    () => { }
                  );
              }
            } else {
              this.message.error(
                'Failed to create email service configuration data.',
                ''
              );
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
  EncryptionData = [
    { Id: 'SYM', Name: 'Symmetric Encryption' },
    { Id: 'ASYM', Name: 'Asymmetric Encryption' },
    { Id: 'HASH', Name: 'Hashing' },
    { Id: 'E2EE', Name: 'End-to-End Encryption (E2EE)' },
    { Id: 'HYBRID', Name: 'Hybrid Encryption' },
    { Id: 'HOMO', Name: 'Homomorphic Encryption' },
    { Id: 'QUANT', Name: 'Quantum Encryption' },
  ];
  isOk = true;
  passwordVisible: boolean = false;
  validateServiceProvider(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s/()\-_.&]+$/; 
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  validateSMTPPort(event: KeyboardEvent): void {
    const allowedPattern = /^[0-9a-zA-Z.:]*$/; 
    const inputChar = String.fromCharCode(event.keyCode);
    if (!allowedPattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  validateSMTPHost(): boolean {
    const smtpPattern = /^([a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/;
    return smtpPattern.test(this.data.SMTP_HOST?.trim());
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
