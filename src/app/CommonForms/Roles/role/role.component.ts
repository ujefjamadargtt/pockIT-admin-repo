import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/CommonModels/role-master';
import { FormMaster } from 'src/app/CommonModels/form-master';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: RoleMaster = new RoleMaster();
  isSpinning = false;
  isFocused: string = '';

  @Input() drawerVisible: boolean = false;
  roles: RoleMaster[] = [];
  forms: FormMaster[] = [];
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    this.loadRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
    }
  }
  isDescriptionInvalid: boolean = false;

  validateDescription(): void {
    this.isDescriptionInvalid =
      !this.data.DESCRIPTION || this.data.DESCRIPTION.length > 512;
  }

  close(): void {
    this.drawerClose();
  }
  selectedRoleName: any;
  onChange(selectedId: number): void {

    const selectedRole = this.roles.find((role) => role.ID === selectedId);


    if (selectedRole) {
      this.selectedRoleName = selectedRole.NAME;
      this.data.PARENT_NAME = this.selectedRoleName;
    } else {
    }
  }
  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (roles) => {
        this.roles = roles['data'];
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong ...', '');
      }
    );
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/;
    const char = String.fromCharCode(event.keyCode || event.which);

    if (!allowedPattern.test(char)) {
      event.preventDefault();
    }
  }

  isOk: boolean = true;
  save(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.data.NAME == null ||
        this.data.NAME == undefined ||
        this.data.NAME.trim() == '') &&
      (this.data.TYPE == null ||
        this.data.TYPE == undefined ||
        this.data.TYPE.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.PARENT_ID == null ||
      this.data.PARENT_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Parent Role', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;

      this.message.error('Please enter name.', '');
      this.isSpinning = false;
      return;
    } else if (
      this.data.TYPE == null ||
      this.data.TYPE == undefined ||
      this.data.TYPE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Type.', '');
      this.isSpinning = false;
      return;
    }
    this.data.PARENT_ID = 0;

    if (this.data.ID) {
      this.api.updateRole(this.data).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Role Updated Successfully...', '');

            if (!addNew) this.drawerClose();

            this.isSpinning = false;
          } else {
            this.message.error('Role Updation Failed...', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
    } else {
      this.api.createRole(this.data).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Role Created Successfully...', '');

            if (!addNew) this.drawerClose();
            else {
              this.data = new RoleMaster();
            }
            this.loadRoles();
            this.isSpinning = false;
          } else {
            this.message.error('Role Creation Failed...', '');
            this.isSpinning = false;
          }
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong ...', '');
        }
      );
    }
  }
}
