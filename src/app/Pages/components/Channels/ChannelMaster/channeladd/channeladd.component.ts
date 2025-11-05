import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { ChannelMaster } from '../../ChannelMaster';
@Component({
  selector: 'app-channeladd',
  templateUrl: './channeladd.component.html',
  styleUrls: ['./channeladd.component.css']
})
export class ChanneladdComponent {
  isSpinning = false;
  isOk = true;

  ngOnInit(): void { }

  public commonFunction = new CommonFunctionService();
  @Input() data: any = ChannelMaster;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }

  resetDrawer(Channelmaster: NgForm) {
    this.data = new ChannelMaster();
    Channelmaster.form.markAsPristine();
    Channelmaster.form.markAsUntouched();
  }

  techData: any = [];

  channelData: any = [];
  isFocused: string = '';

  save(addNew: boolean, Channelmaster: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.CHANNEL_NAME == null ||
      this.data.CHANNEL_NAME == undefined ||
      this.data.CHANNEL_NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Channel Name', '');
    }

    if (this.isOk) {
      if (this.data.DESCRIPTION == '') {
        this.data.DESCRIPTION = null;
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateChannel(this.data).subscribe(
            (successCode: any) => {
              if (successCode['status'] === 200) {
                this.isSpinning = false;
                this.message.success('Channel Updated Successfully', '');
                if (!addNew) this.drawerClose();
              } else {
                this.message.error('Channel Updation Failed', '');
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
          this.api.createChannel(this.data).subscribe(
            (successCode: any) => {
              if (successCode['status'] === 200) {
                this.isSpinning = false;
                this.message.success('Channel Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new ChannelMaster();
                  this.resetDrawer(Channelmaster);
                }
              } else {
                this.isSpinning = false;
                this.message.error('Channel Creation Failed', '');
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

