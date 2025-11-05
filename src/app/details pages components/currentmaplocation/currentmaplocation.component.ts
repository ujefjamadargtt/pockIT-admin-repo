
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
declare const google: any;

@Component({
  selector: 'app-currentmaplocation',
  templateUrl: './currentmaplocation.component.html',
  styleUrls: ['./currentmaplocation.component.css'],
})
export class CurrentmaplocationComponent {
  constructor(private message: NzNotificationService) { }

  technician: any;
  ngOnInit(): void {
    this.initMap();
  }

  @Input() technicianlocationfilter: any;
  @Input() mapdata: any;

  techniciansdata: any;
  handleHttpError(err: HttpErrorResponse) {
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        ''
      );
    } else {
      this.message.error('Something Went Wrong.', '');
    }
  }
  initMap(): void {
    // For technician travel map
    const technician = this.technician;

    // Check for valid technician data with proper latitude and longitude
    const validLocations = this.mapdata.filter(
      (location) =>
        !isNaN(parseFloat(location.LATTITUTE)) &&
        !isNaN(parseFloat(location.LONGITUDE))
    );

    // Calculate the center only if there are valid locations
    const map2Center = {
      lat:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.LATTITUTE),
            0
          ) / validLocations.length
          : 0,
      lng:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.LONGITUDE),
            0
          ) / validLocations.length
          : 0,
    };

    const map2Element = document.getElementById('map1');
    if (map2Element) {
      const map2 = new google.maps.Map(map2Element as HTMLElement, {
        center: map2Center,
        zoom: 14,
      });

      validLocations.forEach((location: any) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.LATTITUTE),
            lng: parseFloat(location.LONGITUDE),
          },
          map: map2,
        });
        // const convertedDate = this.datepipe.transform(location.DATE_TIME, 'h:mm a');
        const infoWindow = new google.maps.InfoWindow({
          content: `
      <div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
          ">
        <h6>${location.TECHNICIAN_NAME}</h6>
        <p>${location.SERVICE_ADDRESS}</p>
        // <p>${location.convertedDate}</p>
      </div>`,
        });

        infoWindow.open(map2, marker);

        marker.addListener('mouseover', () => {
          infoWindow.open(map2, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
      });
    }
  }
}
