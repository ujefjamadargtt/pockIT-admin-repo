import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-view-service-rating',
  templateUrl: './view-service-rating.component.html',
  styleUrls: ['./view-service-rating.component.css'],
})
export class ViewServiceRatingComponent {
  @Input() data: any = ServiceCatMasterDataNew;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe
  ) { }
  isSpinning = false;

  ratingdata: any = [];
  progressList: any;
  averageRating;
  globalRating;
  totalRecords = 1;
  imagePath;
  ngOnInit() {
    this.custToServiceRating();
  }
  getProfileImage(profilePhoto: string | null) {
    return profilePhoto
      ? `${this.api.retriveimgUrl}CustomerProfile/${profilePhoto}`
      : 'assets/img/blueEmpImage.png';
  }

  custToServiceRating() {
    this.isSpinning = true
    this.api
      .custToServiceRating(
        0,
        0,
        '',
        'desc',
        ' AND SERVICE_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ratingdata = data['data'];
            this.totalRecords = Number(data['count']);
            this.averageRating = Number(data['averageRating']);
            this.globalRating = data['count'];
            this.progressList = data['progress'].reverse();
            this.isSpinning = false

          } else {
            this.ratingdata = [];
            this.isSpinning = false

          }
        },
        (err) => {
          this.ratingdata = [];
          this.isSpinning = false

        }
      );
  }

  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
    }
  }
}
